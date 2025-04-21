import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import 'dotenv/config'
import axios from 'axios';

// 全台灣咖啡廳資料
const twCafeUrl = "https://cafenomad.tw/api/v1.2/cafes"
// 允許的縣市清單（英文）
const ALLOWED_CITIES = [
  'taipei',
  'keelung',
  'taoyuan',
  'hsinchu',
  'miaoli',
  'taichung',
  'nantou',
  'changhua',
  'yunlin',
  'chiayi',
  'tainan',
  'kaohsiung',
  'pingtung',
  'yilan',
  'hualien',
  'taitung',
  'penghu',
  'lienchiang'
] as const;

interface Cafe {
  id: string; // 一組UUID
  name: string; // 店名
  wifi: string; // wifi 穩定
  seat: string; // 通常有位
  quiet: string; // 安靜程度
  tasty: string; // 咖啡好喝
  cheap: string; // 價格便宜
  music: string; // 裝潢音樂
  address: string; // 地址
  latitude: string; // 緯度
  longitude: string; // 經度
  url: string; // 官網
  limited_time: string; // 有無限時
  socket: string; // 插座多
  standing_desk: string; // 可站立工作
  mrt: string; // 捷運站
  open_time: string; // 營業時間
}

// 建立 MCP 伺服器
const server = new McpServer({
  name: "TW Cafe Search",
  version: "1.0.0",
  description: "搜尋台灣的咖啡廳",
});

// 驗證城市名稱
function validateCity(city: string): string {
  const lowerCity = city.toLowerCase();
  if (!ALLOWED_CITIES.includes(lowerCity as any)) {
    throw new Error(`不支援的縣市：${city}。請使用以下縣市之一：${ALLOWED_CITIES.join(', ')}`);
  }
  return lowerCity;
}

// Add todo tool - creates a new todo item
server.tool(
  "tw_cafe_search_tool",
  "搜尋台灣的咖啡廳，直隨機挑選 10 間，並回傳咖啡廳的資訊，並且一定要加上 google map 的連結",
  {
    city: z.string().describe(`
      台灣的縣市，例如：taipei, hsinchu, kaohsiung, etc. 
      如輸入中文，會自動轉換為英文
    `),
  },
  async ({ city }) => {
    try {
      if (!city) {
        throw new Error("縣市不能為空");
      }

      // 驗證縣市名稱
      const validCity = validateCity(city);
      
      // 取得全台灣咖啡廳資料
      const response = await axios.get(`${twCafeUrl}/${validCity}`)
      const cafes = response.data as Cafe[];

      if (cafes.length === 0) {
        return {
          content: [{
            type: "text",
            text: `${city} 目前沒有咖啡廳資料`
          }]
        };
      }
  
      // 隨機挑選 10 間，如果不足 10 間，則回傳所有資料
      const randomCafes = cafes.sort(() => Math.random() - 0.5).slice(0, 10);
  
      return {
        content: randomCafes.map((cafe: Cafe) => {
          const googleMapLink = `http://maps.google.com/?q=${encodeURIComponent(cafe.name)}`;
          return {
            type: "text",
            text: `
              店名: ${cafe.name}
              google map: ${googleMapLink}
              地址: ${cafe.address}
              捷運站: ${cafe.mrt}
              營業時間: ${cafe.open_time}
              有無限時: ${cafe.limited_time}
              插座多: ${cafe.socket}
              可站立工作: ${cafe.standing_desk}
              咖啡好喝: ${cafe.tasty}
              價格便宜: ${cafe.cheap}
              裝潢音樂: ${cafe.music}
              安靜程度: ${cafe.quiet}
              通常有位: ${cafe.seat}
            `,
          }
        }),
      };
    } catch (error: any) {
      console.error('咖啡廳搜尋錯誤:', error);
      return {
        content: [{
          type: "text",
          text: error.message || '搜尋咖啡廳時發生未知錯誤'
        }]
      }
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
