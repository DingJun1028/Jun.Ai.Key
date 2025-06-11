import { BaseAgent, AgentMessage, AgentResponse } from '../base-agent';
import { MessageBus } from '../message-bus';
// 假設您有一個 BoostSpace 服務類
// import { BoostSpaceService } from '../services/boost-space-service';

// 定義消息類型常量
const SYNC_KNOWLEDGE_TO_EXTERNAL = 'sync_knowledge_to_external';
const EXTERNAL_SYSTEM_UPDATE_RECEIVED = 'external_system_update_received';

export class OmniSyncAgent extends BaseAgent {
  private messageBus: MessageBus;
  // private boostSpaceService: BoostSpaceService;

  constructor(messageBus: MessageBus /*, boostSpaceService: BoostSpaceService */) {
    super('OmniSyncAgent'); // 萬能同步代理的名稱
    this.messageBus = messageBus;
    // this.boostSpaceService = boostSpaceService;
    this.messageBus.subscribe(this.agentName, this.handleMessage.bind(this));
  }

  protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {
    console.log(`[${this.agentName}] Received message: type=${message.type}, sender=${message.sender}, correlationId=${message.correlationId}`);

    if (message.type === SYNC_KNOWLEDGE_TO_EXTERNAL) {
      const knowledgeItem = message.payload.item;
      // 1. 調用 Boost.space 或其他同步服務
      // await this.boostSpaceService.syncItem(knowledgeItem);
      console.log(`[${this.agentName}] Syncing item to external systems (mock):`, knowledgeItem);
      return { success: true, data: { message: 'Item synced to external systems (mock).' } };
    } else if (message.type === EXTERNAL_SYSTEM_UPDATE_RECEIVED) {
      const externalUpdate = message.payload.update;
      // 1. 處理來自外部系統的更新
      // 2. 可能需要將更新發布到 OmniKeyCoreAgent，再由其路由到 OmniLibraryAgent 進行存儲
      this.messageBus.publish('OmniKeyCoreAgent', {
        type: 'knowledge_store_item', // 假設使用此類型存儲更新
        payload: { item: externalUpdate, source: 'external_sync' },
        sender: this.agentName,
        correlationId: message.correlationId,
      });
      return { success: true, data: { message: 'External update processed and forwarded for storage.' } };
    }

    return { success: false, error: `Unsupported message type for ${this.agentName}: ${message.type}` };
  }

  public async initialize(): Promise<void> {
    // 初始化 Boost.space 連接等
    console.log(`[${this.agentName}] Initialized.`);
  }
}