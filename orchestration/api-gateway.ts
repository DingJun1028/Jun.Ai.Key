/**
 * API 網關（API Gateway）
 * 提供統一 API 入口，串接 NavigationAgent 與記憶庫。
 */
import express from 'express'
import { NavigationAgent } from '../intent/NavigationAgent'
import { MemoryPalace, VectorDatabase } from '../knowledge/MemoryPalace'
import { Orchestrator } from './Orchestrator'

// 假設的 OutputFormatterFactory
const OutputFormatterFactory = {
  getFormatter: () => ({
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
const orchestrator = new Orchestrator()
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
  const { userId, task } = req.body
  try {
    const agent = new NavigationAgent(memoryPalace)
    const result = await agent.executeTask({ userId, description: task })
    const formatter = OutputFormatterFactory.getFormatter()
    res.json(formatter.format(result))
  } catch (error: unknown) {
    res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) })
  }
})

// 新增權能冶煉 API
app.post('/v1/forge-authority', (req, res) => {
  /**
   * @api {post} /v1/forge-authority 鍛造權限物件
   * @apiParam {string} type 權限類型
   * @apiParam {string[]} permissions 權限清單
   * @apiSuccess {object} authority 權限物件
   */
  const { type, permissions } = req.body
  if (!type || !Array.isArray(permissions)) {
    return res.status(400).json({ error: 'type 與 permissions 必填' })
  }
  try {
    const result = orchestrator.dispatch({
      userId: 'api', // 可根據需求擴充
      action: 'forgeAuthority',
      payload: { type, permissions }
    })
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) })
  }
})

// 啟動服務
app.listen(3000, () => {
  console.log('OmniKey Gateway running on port 3000')
})

export { app }
