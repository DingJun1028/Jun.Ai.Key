// API 網關 (API Gateway)
import express from 'express';
import { NavigationAgent } from '../intent/NavigationAgent';
import { MemoryPalace, VectorDatabase } from '../knowledge/MemoryPalace';

// 假設的 OutputFormatterFactory
const OutputFormatterFactory = {
  getFormatter: (platform: string) => ({
    format: (result: any) => result
  })
};

// 假設的向量資料庫實作
const vectorDB: VectorDatabase = {
  async query(params) {
    return [{ content: '記憶片段1' }, { content: '記憶片段2' }];
  },
  async insert(record) {
    // 實際應儲存到資料庫
  }
};

const memoryPalace = new MemoryPalace(vectorDB);
const app = express();
app.use(express.json());

// 統一API端點
app.post('/v1/execute', async (req, res) => {
  const { userId, task, platform } = req.body;
  try {
    const agent = new NavigationAgent(memoryPalace);
    const result = await agent.executeTask({ userId, description: task });
    const formatter = OutputFormatterFactory.getFormatter(platform);
    res.json(formatter.format(result));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 啟動服務
app.listen(3000, () => {
  console.log('OmniKey Gateway running on port 3000');
});
