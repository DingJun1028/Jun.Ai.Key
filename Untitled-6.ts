// 服務存根 - 需要實際實現
export enum AIProvider {
  ChatX = 'ChatX',
  Pollinations = 'Pollinations',
  Straico = 'Straico',
}

interface AIDispatchRequest {
  provider: AIProvider;
  prompt: string;
  options?: Record<string, any>;
}

export class AIServiceRouter {
  async initialize(): Promise<void> {
    console.log('[AIServiceRouter] Initialized (mock).');
  }

  async dispatch(request: AIDispatchRequest): Promise<string> {
    console.log(`[AIServiceRouter] Dispatching to ${request.provider} with prompt (mock): "${request.prompt.substring(0, 50)}..."`);
    return `Mock AI response for provider ${request.provider}.`;
  }
}