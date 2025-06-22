/**
 * 自我導航代理群（Self-Navigating Agent Swarm）
 * 根據任務與記憶自動規劃與執行多步驟任務。
 */
import { MemoryPalace, Context } from '../knowledge/MemoryPalace'
import { BindAiAgent } from '../integration/bindai.agent'

// 型別定義
export interface Task {
  userId: string
  description: string
}

export interface Result {
  // 可根據實際需求擴充
  output: unknown
}

export interface PlanStep {
  skillType: string
  parameters: Record<string, unknown>
}

export interface Plan {
  steps: PlanStep[]
  compileFinalResult(): Result
}

export class NavigationAgent {
  constructor(private memory: MemoryPalace) {}

  /**
   * 執行一個任務，根據記憶自動規劃與執行多步驟
   * @param task 任務描述
   * @returns Promise<Result>
   */
  async executeTask(task: Task): Promise<Result> {
    const context = await this.memory.retrieveContext(task.userId)
    const plan = await this.createPlan(task, context)

    for (const step of plan.steps) {
      const agent = AgentFactory.getAgent(step.skillType)
      if (step.skillType === 'bindai') {
        const prompt = typeof step.parameters.prompt === 'string' ? step.parameters.prompt : String(step.parameters.query || task.description)
        const result = await agent.execute({ prompt })
        await this.memory.storeExecution(step, result)
      } else {
        // 其他 agent 統一傳入 { prompt } 結構，避免型別錯誤
        const prompt = typeof step.parameters.prompt === 'string' ? step.parameters.prompt : String(step.parameters.query || task.description)
        const result = await agent.execute({ prompt })
        await this.memory.storeExecution(step, result)
      }
    }

    return plan.compileFinalResult()
  }

  /**
   * 使用 LLM 產生任務執行計畫
   * @param task 任務
   * @param context 記憶內容
   * @returns Promise<Plan>
   */
  private async createPlan(task: Task, context: Context): Promise<Plan> {
    // 使用LLM生成任務執行計劃
    const llmResponse = await LLMClient.generatePlan({
      task: task.description,
      context: context.snippets,
      availableSkills: this.getAvailableSkills()
    })
    return PlanParser.parse(llmResponse)
  }

  private getAvailableSkills(): string[] {
    // TODO: 回傳可用技能列表
    return ['search', 'summarize', 'executeScript', 'bindai'] // 新增 bindai
  }
}

// AgentFactory 擴充註冊 bindai agent
export const AgentFactory = {
  getAgent: (skillType: string) => {
    if (skillType === 'bindai') {
      return new BindAiAgent(process.env.BINDAI_API_KEY, 'zh-tw')
    }
    return {
      execute: async (_params: { prompt: string }) => ({ output: `Executed ${skillType}` }) // 移除未使用警告
    }
  }
}

export const LLMClient = {
  generatePlan: async (input: { task: string; context: string[]; availableSkills: string[] }) => {
    // 模擬 LLM 回應
    return {
      steps: [
        { skillType: 'search', parameters: { query: input.task } },
        { skillType: 'summarize', parameters: {} }
      ]
    }
  }
}

export const PlanParser = {
  parse: (llmResponse: { steps: PlanStep[] }): Plan => ({
    steps: llmResponse.steps,
    compileFinalResult: () => ({ output: 'Final result' })
  })
}
