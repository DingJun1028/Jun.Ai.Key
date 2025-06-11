import { BaseAgent, AgentMessage, AgentResponse } from '../base-agent';
import { MessageBus } from '../message-bus';
import { AIServiceRouter, AIProvider } from '../services/ai-service-router'; // 實際引入 AIServiceRouter

// 定義消息類型常量
const AI_PROCESS_KNOWLEDGE_RESULTS = 'ai_process_knowledge_results';
const SYSTEM_FINAL_RESPONSE = 'system_final_response';

export class OmniWisdomAgent extends BaseAgent {
  private messageBus: MessageBus;
  private aiRouter: AIServiceRouter;

  constructor(messageBus: MessageBus, aiRouter: AIServiceRouter) {
    super('OmniWisdomAgent'); // 萬能奧義代理的名稱
    this.messageBus = messageBus;
    this.aiRouter = aiRouter;
    this.messageBus.subscribe(this.agentName, this.handleMessage.bind(this));
  }

  protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {
    console.log(`[${this.agentName}] Received message: type=${message.type}, sender=${message.sender}, correlationId=${message.correlationId}`);

    if (message.type === AI_PROCESS_KNOWLEDGE_RESULTS) {
      const { originalQuery, knowledgeResults, originalInput } = message.payload;

      // 1. 根據知識庫結果和原始查詢，構建 AI 服務的提示 (prompt)
      const prompt = this.buildPrompt(originalQuery, knowledgeResults);

      try {
        // 2. 調用 AI 服務 (例如 ChatX，可以通過 AIServiceRouter 配置)
        // 假設 AIServiceRouter 有一個通用的 dispatch 方法
        const aiResponseText = await this.aiRouter.dispatch({
          provider: AIProvider.ChatX, // 假設 ChatX 是默認或配置的提供者
          prompt: prompt,
          // 可以傳遞更多選項，例如 message.payload.aiOptions
        });

        // 3. 將 AI 處理後的結果發送給核心代理
        this.messageBus.publish('OmniKeyCoreAgent', {
          type: SYSTEM_FINAL_RESPONSE,
          payload: {
            finalAnswer: aiResponseText,
            originalInput: originalInput,
            source: this.agentName,
          },
          sender: this.agentName,
          correlationId: message.correlationId,
        });
        console.log(`[${this.agentName}] AI processing complete for correlationId=${message.correlationId}.`);
        return { success: true, data: { message: 'AI processing complete, final response generated.' } };

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown AI service error';
        console.error(`[${this.agentName}] Error calling AI service for correlationId=${message.correlationId}:`, errorMessage);
        // 可以選擇將錯誤信息也發送給核心代理，或者直接返回錯誤
        return { success: false, error: `AI service call failed: ${errorMessage}` };
      }
    }

    return { success: false, error: `Unsupported message type for ${this.agentName}: ${message.type}` };
  }

  private buildPrompt(query: string, knowledge: string[]): string {
    // 實際的提示工程會更複雜
    return `Based on the following knowledge: [${knowledge.map(k => `"${k}"`).join('; ')}], answer the query: "${query}"`;
  }

  public async initialize(): Promise<void> {
    // 初始化 AI 服務路由或其依賴
    await this.aiRouter.initialize(); // 假設 AIServiceRouter 也有初始化方法
    console.log(`[${this.agentName}] Initialized with AI Router.`);
  }
}