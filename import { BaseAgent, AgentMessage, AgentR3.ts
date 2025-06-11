import { BaseAgent, AgentMessage, AgentResponse } from '../base-agent';
import { MessageBus } from '../message-bus';
// 假設您有一個 AI 服務路由類來封裝對不同 AI 服務的調用
// import { AIServiceRouter } from '../services/ai-service-router';

export class OmniWisdomAgent extends BaseAgent {
  private messageBus: MessageBus;
  // private aiRouter: AIServiceRouter;

  constructor(messageBus: MessageBus /*, aiRouter: AIServiceRouter */) {
    super('OmniWisdomAgent'); // 萬能奧義代理的名稱
    this.messageBus = messageBus;
    // this.aiRouter = aiRouter;
    this.messageBus.subscribe(this.agentName, this.handleMessage.bind(this));
  }

  protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {
    console.log(`[${this.agentName}] Received message: type=${message.type}, sender=${message.sender}`);

    if (message.type === 'ai_process_knowledge_results') {
      const { originalQuery, knowledgeResults, originalInput } = message.payload;

      // 1. 根據知識庫結果和原始查詢，構建 AI 服務的提示 (prompt)
      const prompt = this.buildPrompt(originalQuery, knowledgeResults);

      // 2. 調用 AI 服務 (例如 ChatX)
      // const aiResponseText = await this.aiRouter.callChatX(prompt);
      const aiResponseText = `AI enhanced answer for "${originalQuery}" based on [${knowledgeResults.join(', ')}] (mock). Original input was: "${originalInput}"`; // 模擬數據

      // 3. 將 AI 處理後的結果發送給核心代理，由核心代理決定是直接響應給用戶還是進一步處理
      this.messageBus.publish('OmniKeyCoreAgent', {
        type: 'system_final_response', // 新的消息類型，表示這是系統的最終響應之一
        payload: {
          finalAnswer: aiResponseText,
          originalInput: originalInput,
          source: this.agentName,
        },
        sender: this.agentName,
        correlationId: message.correlationId,
      });

      return { success: true, data: { message: 'AI processing complete, final response generated.' } };
    }

    return { success: false, error: `Unsupported message type for ${this.agentName}: ${message.type}` };
  }

  private buildPrompt(query: string, knowledge: string[]): string {
    // 實際的提示工程會更複雜
    return `Based on the following knowledge: [${knowledge.join('; ')}], answer the query: "${query}"`;
  }

  public async initialize(): Promise<void> {
    // 初始化 AI 服務客戶端等
    console.log(`[${this.agentName}] Initialized.`);
  }
}