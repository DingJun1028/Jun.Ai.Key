# Jun.AI.Key API 文件

本文件為 Jun.AI.Key 萬能元鑰系統的 API 說明，採用 OpenAPI 3.0 標準。

## 執行任務（/v1/execute）

- **POST** `/v1/execute`
- 說明：由代理群協作執行任務，支援多平台格式。

### 請求範例

```json
{
  "userId": "user-001",
  "task": "幫我生成一段歡迎詞",
  "platform": "web"
}
```

### 回應範例

```json
{
  "result": "歡迎使用 Jun.AI.Key 萬能元鑰系統！"
}
```

### 參數說明
| 參數      | 型別   | 說明         |
|-----------|--------|--------------|
| userId    | string | 用戶唯一識別 |
| task      | string | 任務描述     |
| platform  | string | 輸出平台     |

---

如需更多 API 或自動產生文件，請參考 `docs/API_LIBRARY.yaml`。