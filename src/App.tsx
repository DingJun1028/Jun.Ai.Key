import React from 'react';
import { NavigationAgent } from '../intent/NavigationAgent';
import { MemoryPalace, VectorDatabase } from '../knowledge/MemoryPalace';

export const App: React.FC = () => {
  // 主程式入口，可根據 props/context 切換鍵盤、短語、API 等
  return (
    <div>
      <h1>Jun.AI.Key 萬能元鑰系統</h1>
      <p>TypeScript SaaS MVP 主程式骨架</p>
      {/* 這裡可根據用戶狀態渲染鍵盤、短語、API 等元件 */}
    </div>
  );
};

// 假設的向量資料庫實作
const vectorDB: VectorDatabase = {
  async query(params) {
    return [{ content: '記憶片段1' }, { content: '記憶片段2' }];
  },
  async insert(record) {
    // 可擴充實際儲存邏輯
  }
};

// 初始化核心模組
const memoryPalace = new MemoryPalace(vectorDB);
const navigationAgent = new NavigationAgent(memoryPalace);

// 若需啟動 API Gateway，請直接執行 orchestration/api-gateway.ts