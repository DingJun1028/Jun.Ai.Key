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