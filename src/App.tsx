import React, { useState } from 'react'
// 導入核心模組
import { NavigationAgent } from '../intent/NavigationAgent'
import { MemoryPalace } from '../knowledge/MemoryPalace'
import { BindAiAgent } from '../integration/bindai.agent'
import './styles/light.css'

// 四大核心支柱說明
const pillars = [
  {
    title: '自我導航',
    desc: '智能體主動解析用戶意圖，規劃任務與知識流。'
  },
  {
    title: '永久記憶',
    desc: '所有互動與知識自動記錄，形成可查詢的知識圖譜。'
  },
  {
    title: '權能冶煉',
    desc: '動態組合技能與權限，賦能用戶與開發者。'
  },
  {
    title: '符文嵌合',
    desc: '自定義自動化規則，串接多端API與代理協作。'
  }
]

// 假設的向量資料庫實作
const vectorDB = {
  async query(_params: { userId: string; vectors: number[]; topK: number }): Promise<Array<{ content: string }>> {
    void _params // 完全消除未使用參數警告
    return [{ content: '記憶片段1' }, { content: '記憶片段2' }]
  },
  async insert(_record: { id: string; data: unknown }): Promise<void> {
    void _record // 完全消除未使用參數警告
    // 可擴充實際儲存邏輯
  }
}

// 類型定義：代理回應
interface AgentResult {
  success: boolean
  data?: unknown
  error?: string
}

export default function App() {
  const [userId, setUserId] = useState('demo-user')
  const [task, setTask] = useState('查詢今日任務')
  const [results, setResults] = useState<AgentResult[]>([
    { success: false },
    { success: false },
    { success: false }
  ])
  const [loading, setLoading] = useState(false)
  // 新增一個 BindAiAgent 實例
  const [bindAiResult, setBindAiResult] = useState<string>('')
  const [bindAiLoading, setBindAiLoading] = useState(false)
  const bindAiAgent = new BindAiAgent(process.env.BINDAI_API_KEY, 'zh-tw')

  // 初始化三個代理與記憶庫
  const memoryPalaces = [
    new MemoryPalace(vectorDB),
    new MemoryPalace(vectorDB),
    new MemoryPalace(vectorDB)
  ]
  const agents = memoryPalaces.map(mp => new NavigationAgent(mp))

  // 多代理協作：同時執行三個代理，並自訂錯誤訊息與 debug log
  const handleExecute = async () => {
    setLoading(true)
    setResults([{ success: false }, { success: false }, { success: false }])
    try {
      // 並行呼叫三個代理 API，並於每次請求前後 log debug 資訊
      const promises = agents.map((_, idx) => {
        const debugId = `[代理${idx + 1}]`
        console.debug(`${debugId} 發送請求`, { userId: userId + '-' + (idx + 1), task })
        return fetch('/v1/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: userId + '-' + (idx + 1), task, platform: 'web' })
        })
          .then(async res => {
            if (!res.ok) {
              const text = await res.text()
              throw new Error(`${debugId} API 錯誤: ${res.status} ${res.statusText} - ${text}`)
            }
            const data = await res.json()
            console.debug(`${debugId} 回傳資料`, data)
            return { success: true, data }
          })
          .catch(e => {
            console.error(`${debugId} 發生錯誤`, e)
            return { success: false, error: `${debugId} 發生自訂錯誤: ${(e instanceof Error ? e.message : String(e))}` }
          })
      })
      const datas = await Promise.all(promises)
      setResults(datas)
    } catch (e) {
      // 理論上不會進到這裡，因為每個 promise 都有 catch
      setResults([
        { success: false, error: '全域自訂錯誤: ' + (e instanceof Error ? e.message : String(e)) },
        { success: false, error: '全域自訂錯誤: ' + (e instanceof Error ? e.message : String(e)) },
        { success: false, error: '全域自訂錯誤: ' + (e instanceof Error ? e.message : String(e)) }
      ])
    } finally {
      setLoading(false)
    }
  }

  // 新增一個處理 BindAi 輸入的函式
  const handleBindAi = async () => {
    setBindAiLoading(true)
    setBindAiResult('')
    try {
      const result = await bindAiAgent.execute({ prompt: task })
      setBindAiResult(result.output)
    } catch (e) {
      setBindAiResult(e instanceof Error ? e.message : String(e))
    } finally {
      setBindAiLoading(false)
    }
  }

  return (
    <div className="app-container">
      <h1>Jun.AI.Key 萬能元鑰系統</h1>
      <p>歡迎使用！請於左側選單選擇功能。</p>
      <h2>四大核心支柱</h2>
      <ul className="pillar-list">
        {pillars.map(p => (
          <li key={p.title}>
            <strong>{p.title}：</strong>{p.desc}
          </li>
        ))}
      </ul>
      <h3>多代理協作互動</h3>
      <div className="agent-section">
        <label className="input-label">
          用戶ID：
          <input value={userId} onChange={e => setUserId(e.target.value)} />
        </label>
        <label className="input-label">
          任務描述：
          <input className="input-task" value={task} onChange={e => setTask(e.target.value)} />
        </label>
        <button className="btn" onClick={handleExecute} disabled={loading}>
          {loading ? '執行中...' : '三代理同時執行任務'}
        </button>
      </div>
      <h4>三代理執行結果</h4>
      <div className="agent-results">
        {results.map((r, i) => (
          <pre key={i} className="agent-result">
            <b>代理 {i + 1}</b>{'\n'}
            {r.success
              ? <span className="agent-result-success">✅ 成功\n{JSON.stringify(r.data, null, 2)}</span>
              : <span className="agent-result-fail">❌ 失敗\n{r.error}</span>
            }
          </pre>
        ))}
      </div>
      <hr />
      <h3>BindAi 直接互動（TypeScript 服務整合）</h3>
      <div className="bindai-section">
        <button className="btn" onClick={handleBindAi} disabled={bindAiLoading}>
          {bindAiLoading ? '執行中...' : '呼叫 BindAi 服務'}
        </button>
        <div className={bindAiResult ? 'bindai-output' : 'bindai-output empty'}>
          {bindAiResult ? <pre>{bindAiResult}</pre> : '點擊上方按鈕，直接用 TypeScript 呼叫 BindAi'}
        </div>
      </div>
      <h3>進化飛輪</h3>
      <ol>
        <li>用戶互動</li>
        <li>智能體規劃</li>
        <li>知識記憶</li>
        <li>自動化協作</li>
        <li>能力進化</li>
      </ol>
      <p className="copyright">© 2025 Jun.AI.Key Collective</p>
    </div>
  )
}
