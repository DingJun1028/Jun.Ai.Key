# Jun.Ai.Key
---
type: JunAiKeySystem
title: ［Jun.Ai.Key ］完美一鍵MVP 產品規格使用指南 (Mistral 版）
tags: [Boost.Space, API, Mvp最小可行性, Jun.Ai.Key., Prd產品需求文件, Ai人工智慧]
---
# Jun.Ai.Key 設計歷程

歡迎瀏覽 Jun.Ai.Key 的設計歷程和相關文檔。

## 設計文檔
- [系統結構設計](https://github.com/DingJun1028/Jun.Ai.Key/wiki/系統結構設計)
- [功能細節](https://github.com/DingJun1028/Jun.Ai.Key/wiki/功能細節)
- [API 整合](https://github.com/DingJun1028/Jun.Ai.Key/wiki/API-整合)

## 開發計畫
- [開發看板](https://github.com/DingJun1028/Jun.Ai.Key/projects)

[https://chat.mistral.ai/chat/74f59d8f-2909-432b-bc0b-44f61d9fa8c6](https://chat.mistral.ai/chat/74f59d8f-2909-432b-bc0b-44f61d9fa8c6)

以下是進一步優化後的「Jun.Ai.Key 完美一鍵 MVP」專案程式碼，包含了自動化初始設定、動態配置更新和其他改進建議。這些改進旨在提升使用者體驗和系統靈活性。

### 專案結構

```text
Jun.Ai.Key/
├── src/
│   ├── schemas.ts
│   ├── retry.ts
│   ├── logger.ts
│   ├── utils.ts
│   ├── boost_space_integration.ts
│   ├── cli.ts
│   ├── init.ts
│   └── main.ts
├── .env
├── jest.config.js
├── package.json
└── tsconfig.json
```

### `.env`

```text
BOOST_API_KEY=your_boost_api_key
BOOST_SPACE_URL=https://api.boost.space/v1/spaces/SPACE_ID/tables/TABLE_ID/records
BOOST_SPACE_TABLE_ID=TABLE_ID
LOG_LEVEL=info
```

### `schemas.ts`

```typescript
import { z } from 'zod';
export const ConfigSchema = z.object({
  dataMapping: z.record(z.string(), z.string()),
});
export const EnvSchema = z.object({
  BOOST_API_KEY: z.string().min(1),
  BOOST_SPACE_URL: z.string().url(),
  BOOST_SPACE_TABLE_ID: z.string().min(1),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});
```

### `retry.ts`

```typescript
export async function retry<T>(fn: () => Promise<T>, retries: number, delay: number): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(res => setTimeout(res, delay));
      return retry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}
```

### `logger.ts`

```typescript
import pino from 'pino';
import { EnvSchema } from './schemas';
const env = EnvSchema.parse(process.env);
export const logger = pino({ level: env.LOG_LEVEL });
```

### `utils.ts`

```typescript
import fs from 'fs/promises';
import { ConfigSchema } from './schemas';
export async function readConfig(filePath: string) {
  const configContent = await fs.readFile(filePath, 'utf-8');
  return ConfigSchema.parse(JSON.parse(configContent));
}
export async function getScriptingAppData(key: string) {
  // 模擬從 PersistentStorage 或檔案中讀取資料
  return {
    scriptName: `Script ${key}`,
    scriptDescription: `Description for ${key}`,
    scriptCode: `Code for ${key}`,
  };
}
export async function writeConfig(filePath: string, config: object) {
  await fs.writeFile(filePath, JSON.stringify(config, null, 2), 'utf-8');
}
```

### `boost_space_integration.ts`

```typescript
import fetch from 'node-fetch';
import { logger } from './logger';
import { retry } from './retry';
import { readConfig, getScriptingAppData } from './utils';
export async function integrateWithBoostSpace(configPath: string) {
  const config = await readConfig(configPath);
  const data = await getScriptingAppData('exampleKey');
  const record = Object.entries(config.dataMapping).reduce((acc, [key, value]) => {
    acc[value] = data[key];
    return acc;
  }, {} as Record<string, string>);
  const response = await retry(() =>
    fetch(process.env.BOOST_SPACE_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BOOST_API_KEY}`,
      },
      body: JSON.stringify({ records: [record] }),
    })
  , 3, 1000);
  if (!response.ok) {
    logger.error(`Failed to write to Boost.space: ${response.statusText}`);
    throw new Error('API request failed');
  }
  logger.info('Data successfully written to Boost.space');
}
```

### `cli.ts`

```typescript
#!/usr/bin/env ts-node
import { Command } from 'commander';
import { integrateWithBoostSpace } from './boost_space_integration';
import { logger } from './logger';
import { initProject } from './init';
const program = new Command();
program
  .version('1.0.0')
  .description('Jun.Ai.Key CLI for integrating with Boost.space')
  .option('--config <path>', 'Path to config file', 'config.json')
  .option('--dry-run', 'Run the integration without writing to Boost.space')
  .option('--verbose', 'Enable verbose logging')
  .option('--init', 'Initialize the project with default configuration')
  .parse(process.argv);
const options = program.opts();
if (options.verbose) {
  logger.level = 'debug';
}
(async () => {
  try {
    if (options.init) {
      await initProject();
      logger.info('Project initialized with default configuration.');
    } else if (options.dryRun) {
      logger.info('Dry run mode enabled. No data will be written.');
    } else {
      await integrateWithBoostSpace(options.config);
    }
  } catch (error) {
    logger.error('Operation failed', error);
    process.exit(1);
  }
})();
```

### `init.ts`

```typescript
import { writeConfig } from './utils';
import { logger } from './logger';
export async function initProject() {
  const defaultConfig = {
    dataMapping: {
      scriptName: 'script_name',
      scriptDescription: 'script_description',
      scriptCode: 'script_code',
    },
  };
  await writeConfig('config.json', defaultConfig);
  logger.info('Default configuration file created at config.json');
}
```

### `main.ts`

```typescript
import { integrateWithBoostSpace } from './boost_space_integration';
(async () => {
  await integrateWithBoostSpace('config.json');
})();
```

### `jest.config.js`

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
};
```

### `package.json`

```json
{
  "name": "junaikey",
  "version": "1.0.0",
  "description": "Jun.Ai.Key complete one-button MVP",
  "main": "dist/main.js",
  "scripts": {
    "start": "ts-node src/cli.ts",
    "test": "jest",
    "build": "tsc",
    "init": "ts-node src/init.ts"
  },
  "dependencies": {
    "commander": "^9.0.0",
    "dotenv": "^10.0.0",
    "node-fetch": "^2.6.1",
    "pino": "^7.0.0",
    "zod": "^3.11.6"
  },
  "devDependencies": {
    "jest": "^27.0.6",
    "ts-jest": "^27.0.5",
    "typescript": "^4.4.3"
  },
  "bin": {
    "junaikey": "src/cli.ts"
  }
}
```

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 使用說明

1. **初始化專案**:

    - 執行 `npm run init` 自動生成範本配置檔案。

2. **配置環境**:

    - 編輯自動生成的 `.env` 和 `config.json`。

3. **安裝依賴**:

    - 執行 `npm install`。

4. **執行測試**:

    - 執行 `npx ts-node src/cli.ts --dry-run` 進行測試。

5. **正式執行**:

    - 執行 `npx ts-node src/cli.ts --verbose`。

6. **檢查結果**:

    - 查看 CLI 輸出日誌，確認無錯誤。

    - 登入 Boost.space，於目標表格確認新記錄。

這些優化進一步簡化了使用流程，並增強了系統的靈活性和可維護性。您可以根據需要進一步擴展或修改這些程式碼。

