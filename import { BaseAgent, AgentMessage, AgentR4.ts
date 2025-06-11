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
}import { MessageBus } from './message-bus';
import { AgentRegistry } from './agent-registry';
import { BaseAgent, AgentMessage, AgentResponse } from './base-agent';

export class OmniKeyCoreAgent extends BaseAgent {
  private agentRegistry: AgentRegistry;
  private messageBus: MessageBus;

  constructor(agentRegistry: AgentRegistry, messageBus: MessageBus) {
    super('OmniKeyCoreAgent');
    this.agentRegistry = agentRegistry;
    this.messageBus = messageBus;
    this.messageBus.subscribe(this.agentName, this.handleMessage.bind(this));
  }

  protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {
    console.log(`[${this.agentName}] Received message: ${message.type}`);
    // 路由邏輯：根據 message.type 將消息轉發給相應的功能代理
    // 例如：如果 message.type 是 'process_input'，則轉發給萬能輸入代理
    const targetAgentName = this.determineTargetAgent(message.type);
    if (targetAgentName) {
      const targetAgent = this.agentRegistry.getAgent(targetAgentName);
      if (targetAgent) {
        // 異步轉發，不阻塞核心代理
        this.messageBus.publish(targetAgentName, message);
        return { success: true, data: { message: 'Request routed' } };
      } else {
        return { success: false, error: `Agent ${targetAgentName} not found.` };
      }
    }
    return { success: false, error: `No route for message type: ${message.type}` };
  }

  private determineTargetAgent(messageType: string): string | null {
    if (messageType.startsWith('input_')) return 'OmniFormatAgent'; // 萬能輸入代理
    if (messageType.startsWith('knowledge_')) return 'OmniLibraryAgent'; // 萬能智庫代理
    if (messageType.startsWith('ai_')) return 'OmniWisdomAgent'; // 萬能奧義代理
    if (messageType.startsWith('sync_')) return 'OmniSyncAgent'; // 萬能同步代理
    // ... 其他路由規則
    return null;
  }

  public async initialize(): Promise<void> {
    console.log(`[${this.agentName}] Initialized.`);
  }
}
type MessageHandler = (message: AgentMessage) => Promise<void>;

export class MessageBus {
  private subscribers: Map<string, MessageHandler[]> = new Map();

  public subscribe(topic: string, handler: MessageHandler): void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, []);
    }
    this.subscribers.get(topic)!.push(handler);
    console.log(`[MessageBus] Handler subscribed to topic: ${topic}`);
  }

  public async publish(topic: string, message: AgentMessage): Promise<void> {
    const handlers = this.subscribers.get(topic);
    if (handlers) {
      console.log(`[MessageBus] Publishing to topic: ${topic}, message: ${message.type}`);
      // 使用 Promise.allSettled 確保所有處理器都被調用，即使其中一些失敗
      await Promise.allSettled(handlers.map(handler => handler(message)));
    } else {
      console.warn(`[MessageBus] No subscribers for topic: ${topic}`);
    }
  }
}
// /packages/core-engine/src/base-agent.ts
export interface AgentMessage {
  type: string;
  payload: any;
  sender?: string; // 可選，用於追蹤消息來源
  correlationId?: string; // 可選，用於追蹤請求鏈
}

export interface AgentResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export abstract class BaseAgent {
  protected agentName: string;

  constructor(agentName: string) {
    this.agentName = agentName;
  }

  abstract handleMessage(message: AgentMessage): Promise<AgentResponse>;
  abstract initialize(): Promise<void>;
}
// /packages/core-engine/src/message-bus.ts
import { AgentMessage } from './base-agent';

type MessageHandler = (message: AgentMessage) => Promise<void>;

export class MessageBus {
  private subscribers: Map<string, MessageHandler[]> = new Map();

  public subscribe(topic: string, handler: MessageHandler): void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, []);
    }
    this.subscribers.get(topic)!.push(handler);
    console.log(`[MessageBus] Handler subscribed to topic: ${topic} by ${handler.name || 'anonymous_handler'}`);
  }

  public async publish(topic: string, message: AgentMessage): Promise<void> {
    const handlers = this.subscribers.get(topic);
    if (handlers && handlers.length > 0) {
      console.log(`[MessageBus] Publishing to topic: ${topic}, message type: ${message.type}, sender: ${message.sender}`);
      // 使用 Promise.allSettled 確保所有處理器都被調用，即使其中一些失敗
      const results = await Promise.allSettled(handlers.map(handler => handler(message)));
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`[MessageBus] Error in handler for topic ${topic} (handler ${index}):`, result.reason);
        }
      });
    } else {
      console.warn(`[MessageBus] No subscribers for topic: ${topic}`);
    }
  }
}
// /packages/core-engine/src/omni-key-core-agent.ts
import { MessageBus } from './message-bus';
import { AgentRegistry } from './agent-registry';
import { BaseAgent, AgentMessage, AgentResponse } from './base-agent';

export class OmniKeyCoreAgent extends BaseAgent {
  private agentRegistry: AgentRegistry;
  private messageBus: MessageBus;

  constructor(agentRegistry: AgentRegistry, messageBus: MessageBus) {
    super('OmniKeyCoreAgent'); // 核心代理的名稱
    this.agentRegistry = agentRegistry;
    this.messageBus = messageBus;
    // 核心代理訂閱自身主題以接收外部請求或內部協調消息
    this.messageBus.subscribe(this.agentName, this.handleMessage.bind(this));
  }

  protected async handleMessage(message: AgentMessage): Promise<AgentResponse> {
    console.log(`[${this.agentName}] Received message: type=${message.type}, sender=${message.sender}`);

    const targetAgentName = this.determineTargetAgent(message.type);

    if (targetAgentName) {
      const targetAgent = this.agentRegistry.getAgent(targetAgentName);
      if (targetAgent) {
        // 創建一個新的消息對象，並將核心代理標記為發送者
        const outboundMessage: AgentMessage = {
          ...message, // 傳播原始消息的 payload 和 correlationId
          sender: this.agentName, // 標記消息由核心代理發出
        };
        // 異步轉發到目標代理的主題
        this.messageBus.publish(targetAgentName, outboundMessage);
        console.log(`[${this.agentName}] Routed message type ${message.type} to agent ${targetAgentName}`);
        return { success: true, data: { message: `Request routed to ${targetAgentName}` } };
      } else {
        console.error(`[${this.agentName}] Agent ${targetAgentName} not found in registry.`);
        return { success: false, error: `Agent ${targetAgentName} not found.` };
      }
    }
    console.warn(`[${this.agentName}] No route for message type: ${message.type}`);
    return { success: false, error: `No route for message type: ${message.type}` };
  }

  private determineTargetAgent(messageType: string): string | null {
    // 這裡的路由規則需要根據您的具體代理名稱進行調整
    if (messageType.startsWith('input_')) return 'OmniFormatAgent';
    if (messageType.startsWith('knowledge_')) return 'OmniLibraryAgent';
    if (messageType.startsWith('ai_')) return 'OmniWisdomAgent';
    if (messageType.startsWith('sync_')) return 'OmniSyncAgent';
    // ... 其他路由規則
    return null;
  }

  public async initialize(): Promise<void> {
    // 核心代理的初始化邏輯，例如加載配置等
    console.log(`[${this.agentName}] Initialized.`);
  }
}
// /packages/core-engine/src/agent-registry.ts
import { BaseAgent } from './base-agent';

export class AgentRegistry {
  private agents: Map<string, BaseAgent> = new Map();

  public registerAgent(agent: BaseAgent): void {
    if (this.agents.has(agent.agentName)) {
      console.warn(`[AgentRegistry] Agent with name ${agent.agentName} is already registered. Overwriting.`);
    }
    this.agents.set(agent.agentName, agent);
    console.log(`[AgentRegistry] Agent registered: ${agent.agentName}`);
  }

  public getAgent(agentName: string): BaseAgent | undefined {
    return this.agents.get(agentName);
  }

  public getAllAgents(): BaseAgent[] {
    return Array.from(this.agents.values());
  }
}
