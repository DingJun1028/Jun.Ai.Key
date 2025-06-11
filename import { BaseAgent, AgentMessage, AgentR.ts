import { BaseAgent, AgentMessage, AgentResponse } from '../base-agent';
import { MessageBus } from '../message-bus';
// 假設您有一個 Supabase 服務類來封裝 Supabase 的操作
// import { SupabaseService } from '../services/supabase-service';

export class OmniLibraryAgent extends BaseAgent {
  private messageBus: MessageBus;
  // private supabaseService: SupabaseService;

  constructor(messageBus: MessageBus /*, supabaseService: SupabaseService */) {
    super('OmniLibraryAgent'); // 萬能智庫代理的名稱
    this.messageBus = messageBus;
    // this.supabaseService = supabaseService;
    this.messageBus.subscribe(this.agentName, this.handleMessage.bind(this));
  }

  protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {
    console.log(`[${this.agentName}] Received message: type=${message.type}, sender=${message.sender}`);

    if (message.type === 'knowledge_query_text') {
      const queryText = message.payload.text;
      // 1. 實際查詢知識庫的邏輯
      // const results = await this.supabaseService.queryKnowledge(queryText);
      const results = [`Mock result for: ${queryText} 1`, `Mock result for: ${queryText} 2`]; // 模擬數據

      // 2. 將查詢結果發送給核心代理進行下一步路由或直接響應
      // 這裡假設直接發送給 AI 代理進行處理
      this.messageBus.publish('OmniKeyCoreAgent', {
        type: 'ai_process_knowledge_results', // 新的消息類型，指示 AI 處理知識庫結果
        payload: {
          originalQuery: queryText,
          knowledgeResults: results,
          originalInput: message.payload.originalInput,
        },
        sender: this.agentName,
        correlationId: message.correlationId,
      });

      return { success: true, data: { message: 'Knowledge query processed and results forwarded for AI processing.' } };
    } else if (message.type === 'knowledge_store_item') {
      // 處理存儲新知識點的邏輯
      // const itemToStore = message.payload.item;
      // await this.supabaseService.storeItem(itemToStore);
      console.log(`[${this.agentName}] Storing item:`, message.payload.item);
      return { success: true, data: { message: 'Item stored successfully (mock).' } };
    }

    return { success: false, error: `Unsupported message type for ${this.agentName}: ${message.type}` };
  }

  public async initialize(): Promise<void> {
    // 初始化 Supabase 連接等
    console.log(`[${this.agentName}] Initialized.`);
  }
}