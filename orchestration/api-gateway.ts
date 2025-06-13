/**
 * API 網關（API Gateway）
 * 提供統一 API 入口，串接 NavigationAgent 與記憶庫。
 */
import express from 'express'
import { NavigationAgent } from '../intent/NavigationAgent'
import { MemoryPalace, VectorDatabase } from '../knowledge/MemoryPalace'

// 假設的 OutputFormatterFactory
const OutputFormatterFactory = {
  getFormatter: (_platform: string) => ({
    format: (result: unknown) => result
  })
}

// 假設的向量資料庫實作
const vectorDB: VectorDatabase = {
  async query(_params) {
    void _params
    return [{ content: '記憶片段1' }, { content: '記憶片段2' }]
  },
  async insert(_record) {
    void _record
    // 實際應儲存到資料庫
  }
}

const memoryPalace = new MemoryPalace(vectorDB)
const app = express()
app.use(express.json())

// 統一API端點
app.post('/v1/execute', async (req, res) => {
  /**
   * @api {post} /v1/execute 執行任務
   * @apiParam {string} userId 用戶ID
   * @apiParam {string} task 任務描述
   * @apiParam {string} platform 輸出平台
   * @apiSuccess {object} result 執行結果
   */
  const { userId, task, platform } = req.body
  try {
    const agent = new NavigationAgent(memoryPalace)
    const result = await agent.executeTask({ userId, description: task })
    const formatter = OutputFormatterFactory.getFormatter(platform)
    res.json(formatter.format(result))
  } catch (error: unknown) {
    res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) })
  }
})

// 啟動服務
app.listen(3000, () => {
  console.log('OmniKey Gateway running on port 3000')
})
