# 台灣咖啡廳搜尋工具 (Taiwan Cafe Search Tool)

這是一個基於 MCP (Model Context Protocol) 開發的台灣咖啡廳搜尋工具，能夠幫助使用者快速找到各縣市的咖啡廳資訊。

<img width="713" alt="Screenshot 2025-04-22 at 1 47 59 AM" src="https://github.com/user-attachments/assets/6a8636f5-48e7-4bfa-9daf-e28772a406c9" />

## 功能特色

- 支援全台灣各縣市的咖啡廳搜尋
- 每次隨機推薦 10 間咖啡廳
- 提供詳細的咖啡廳資訊，包括：
  - 店名
  - Google Maps 連結
  - 詳細地址
  - 營業時間
  - 是否有時間限制
  - 插座供應情況
  - 是否可站立工作
  - 咖啡品質評分
  - 價格評分
  - 裝潢音樂評分
  - 安靜程度評分
  - 座位供應情況評分

## MCP 安裝設定
1. `npm install`

2. 設定 MCP Config
```
"tw-cafe-mcp": {
  "command": "npx",
  "args": [
  "tsx",
  "/Users/lidongying/Documents/Projects/tw-cafe-mcp/index.ts"
  ]
}

```

## 使用方式

Prompt 範例：
`幫我搜尋台北咖啡廳`

## 資料來源

本工具使用 [Cafe Nomad API](https://cafenomad.tw/) 提供的資料。
