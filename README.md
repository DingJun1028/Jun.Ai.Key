以下是根據你提供的內容，整理、優化後的 README.md 詳細範例：

---

# Jun.Ai.Key 全面整合倉庫

> 本專案為「Jun.Ai.Key 萬能元鑰」整合版，支援一鍵啟動、Supabase 同步、完整 API 文件庫，以及一鍵部署至 GitHub Pages 和 Supabase Edge Functions。

---

## 📂 專案結構

```
jun-ai-key/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # CI & 部署流程
│       └── deploy.yml
├── docs/
│   ├── SPEC.md                    # 系統規格書
│   └── API_LIBRARY.md             # API 文件庫
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   ├── straicoApi.ts
│   │   ├── boostApi.ts
│   │   └── capacitiesApi.ts
│   ├── components/
│   ├── hooks/
│   ├── models/
│   ├── scriptApp/
│   ├── styles/
│   ├── App.tsx
│   └── index.tsx
├── supabase/
│   ├── migrations/
│   └── functions/                 # Edge Functions
├── .env.example
├── README.md
├── package.json
├── tsconfig.json
└── SPEC.md                        # 根目錄快速連結
```

---

## 📄 重要文件說明

- `docs/SPEC.md`：詳細系統規格，涵蓋架構、功能、API、資料設計、安全與維運等。
- `docs/API_LIBRARY.md`：彙整 Capacities、Taskade、Boost.space、GitHub、Infoflow、OpenAI、Pollinations.AI 各平台 API，包含金鑰設定、BaseURL、常用端點、文件連結及相似 App 推薦。

---

## 🚀 快速開始

### 1. 安裝環境

- Node.js、npm
- Supabase CLI (`npm install -g supabase`)
- 已 fork/clone 本專案並連結至 GitHub

### 2. 設定環境變數

複製 `.env.example` 為 `.env`，填入你的 Supabase 及各平台 API 金鑰：

```
SUPABASE_URL=<YOUR_SUPABASE_URL>
SUPABASE_ANON_KEY=<YOUR_ANON_KEY>
SUPABASE_SERVICE_ROLE_KEY=<YOUR_SERVICE_ROLE_KEY>
STRAICO_API_KEY=<STRAICO_KEY>
BOOST_API_KEY=<BOOST_SPACE_KEY>
CAPACITIES_API_KEY=<CAPACITIES_KEY>
OPENAI_API_KEY=<OPENAI_KEY>
```

### 3. 本地啟動

```bash
git clone https://github.com/<帳號>/jun-ai-key.git
cd jun-ai-key
npm install
npm start
# Edge Functions 偵錯
cd supabase/functions
supabase functions serve
```

---

## 🤖 CI / CD 與自動部署

- `.github/workflows/ci.yml`：自動 lint、build、test
- `.github/workflows/deploy.yml`：push main 分支後自動部署至 GitHub Pages & Supabase Edge Functions

### CI 範例

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: node-version: '16'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test
```

### 部署範例

```yaml
name: Deploy
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with: node-version: '16'
      - run: npm ci
      - run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
      - name: Deploy Supabase Functions
        run: |
          supabase login
          supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_ID }}
          supabase functions deploy --no-verify
```

---

## 📦 NPM 腳本

`package.json` 常用腳本：

```json
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "lint": "eslint 'src/**/*.{ts,tsx}'",
  "test": "react-scripts test",
  "deploy:supabase": "supabase functions deploy && supabase db push",
  "deploy:pages": "npm run build && npm run deploy:ghpages"
}
```

---

## 🛠️ 一鍵全自動流程

```bash
# 1. 本地測試
git clone https://github.com/<帳號>/jun-ai-key.git && cd jun-ai-key
npm install && npm start

# 2. 一鍵 CI & 部署
git add . && git commit -m "Release"
git push origin main
# GitHub Actions 將自動執行 CI & 部署
```

---

## 📚 文件與注意事項

- 完整規格及 API 文件請詳見 `docs/SPEC.md`、`docs/API_LIBRARY.md`
- 請於 GitHub Secrets 設定 `SUPABASE_PROJECT_ID`、各平台 API 金鑰及 `GITHUB_TOKEN`

---

如需更動，請直接將上述內容複製到你的 `README.md`，並根據實際專案路徑與細節做微調！
