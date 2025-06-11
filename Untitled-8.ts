import { MessageBus } from './message-bus';
import { AgentRegistry } from './agent-registry';
import { OmniKeyCoreAgent } from './omni-key-core-agent';
import { OmniFormatAgent } from './agents/omni-format-agent';
import { OmniLibraryAgent } from './agents/omni-library-agent';
import { OmniWisdomAgent } from './agents/omni-wisdom-agent';
import { OmniSyncAgent } from './agents/omni-sync-agent';
import { AIServiceRouter } from './services/ai-service-router';
import { SupabaseService } from './services/supabase-service';
// import { BoostSpaceService } from './services/boost-space-service'; // 如果需要

async function bootstrap() {
  console.log('Bootstrapping Jun.Ai.Key System...');

  // 1. 初始化核心組件
  const messageBus = new MessageBus();
  const agentRegistry = new AgentRegistry();

  // 2. 初始化服務 (如果它們有自己的初始化邏輯或依賴)
  const aiRouter = new AIServiceRouter();
  await aiRouter.initialize(); // 確保服務在使用前已初始化

  const supabaseService = new SupabaseService();
  await supabaseService.initialize();

  // const boostSpaceService = new BoostSpaceService();
  // await boostSpaceService.initialize();

  // 3. 實例化所有代理
  const omniKeyCoreAgent = new OmniKeyCoreAgent(agentRegistry, messageBus);
  const omniFormatAgent = new OmniFormatAgent(messageBus);
  const omniLibraryAgent = new OmniLibraryAgent(messageBus /*, supabaseService */); // 傳入 SupabaseService
  const omniWisdomAgent = new OmniWisdomAgent(messageBus, aiRouter); // 傳入 AIServiceRouter
  const omniSyncAgent = new OmniSyncAgent(messageBus /*, boostSpaceService */);

  // 4. 將代理註冊到註冊表
  agentRegistry.registerAgent(omniKeyCoreAgent);
  agentRegistry.registerAgent(omniFormatAgent);
  agentRegistry.registerAgent(omniLibraryAgent);
  agentRegistry.registerAgent(omniWisdomAgent);
  agentRegistry.registerAgent(omniSyncAgent);

  // 5. 初始化所有代理
  // OmniKeyCoreAgent 已經在其構造函數中訂閱了消息
  // 其他代理也在其構造函數中訂閱了消息
  // 我們需要確保它們的 initialize 方法被調用
  for (const agent of agentRegistry.getAllAgents()) {
    await agent.initialize();
  }

  console.log('Jun.Ai.Key System Bootstrapped Successfully!');

  // 6. 模擬一個外部請求來測試流程
  console.log('\n--- Simulating User Input ---');
  messageBus.publish('OmniKeyCoreAgent', { // 將初始請求發送給核心代理
    type: 'input_process_text', // 這是 OmniFormatAgent 期望的類型，但核心代理會路由
    payload: { text: '  Hello Jun.Ai.Key!  ' },
    sender: 'ExternalClient',
    correlationId: `test-${Date.now()}`,
  });
}

bootstrap().catch(error => {
  console.error('Failed to bootstrap the system:', error);
});