# JunAiKey 產品規格文件（SPEC）

- 版本：1.0.0-mvp
- 文件負責人：Jun 洪鼎竣
- 發布日期：2025-06-25
- 相關文件：[PRD.md](./PRD.md)

---

## 目錄
1. 系統架構與模組分層
2. 技術棧與依賴
3. 數據模型
4. API/接口規格
5. 業務邏輯與流程
6. 性能與安全需求
7. 測試規範
8. 版本管理與更新紀錄

---

### 1. 系統架構與模組分層
- 萬能元鑰（OmniKey）為核心，統御四大能力
- 四大支柱模組（NavigationAgent, MemoryPalace, AuthorityForgeEngine, RuneEngravingSystem）
- 雙核心雙向同步（BoostSpace ↔ Supabase）
- 插件/代理生態

---

### 2. 技術棧與依賴
- TypeScript、Node.js、Supabase、GitHub Actions
- 前端：React/TypeScript
- 後端：Express/Node.js
- 資料庫：Supabase（PostgreSQL）

---

### 3. 數據模型
- 任務（Task）：id, title, status, due_date, source, updated_at, version
- 知識（Knowledge）：id, content, tags, created_at
- 日誌（ai_logs）：id, task_id, date, summary, raw_output, status, created_at

---

### 4. API/接口規格
#### 4.1 RESTful API
- POST /v1/execute
  - 輸入：{ userId, task, platform }
  - 輸出：{ result, status }
- GET /v1/tasks
  - 查詢用戶任務列表

#### 4.2 Webhook
- /sync/boostspace-webhook-handler.ts
- /sync/supabase-trigger-handler.ts

---

### 5. 業務邏輯與流程
- 任務分解：LLMClient.generatePlan → PlanParser.parse
- 知識檢索：EmbeddingService.generate → VectorDatabase.query
- 同步防迴圈：比對 updated_at/version，來源標記

---

### 6. 性能與安全需求
- API 響應 < 300ms
- 同步延遲 < 1s
- 記憶檢索準確率 > 92%
- 用戶資料加密、權限控管

---

### 7. 測試規範
- 單元測試覆蓋率 > 80%
- 端到端測試：任務同步、知識檢索、API 響應
- 驗收標準：PRD 所列指標全部達標

---

### 8. 版本管理與更新紀錄
| 版本 | 日期 | 內容 | 負責人 |
|------|------|------|--------|
| 1.0.0 | 2025-06-25 | 初版建立 | Jun 洪鼎竣 |
