// 永久記憶庫 (Memory Palace)

// 型別定義
export interface Context {
  userId: string;
  snippets: string[];
}

export interface PlanStep {
  skillType: string;
  parameters: any;
}

// 假設的向量資料庫介面
export interface VectorDatabase {
  query(params: { userId: string; vectors: number[]; topK: number }): Promise<Array<{ content: string }>>;
  insert(record: any): Promise<void>;
}

// 假設的嵌入服務
export const EmbeddingService = {
  generate: async (keywords: string[]): Promise<number[]> => {
    // 模擬嵌入向量
    return [1, 2, 3];
  }
};

export class MemoryPalace {
  constructor(private vectorDB: VectorDatabase) {}

  async retrieveContext(userId: string): Promise<Context> {
    // 假設有 task.keywords，實際應根據需求傳入
    const keywords = ['default'];
    const embeddings = await EmbeddingService.generate(keywords);
    const memories = await this.vectorDB.query({
      userId,
      vectors: embeddings,
      topK: 5
    });
    return {
      userId,
      snippets: memories.map(m => m.content)
    };
  }

  async storeExecution(step: PlanStep, result: any): Promise<void> {
    const memoryRecord = {
      type: 'execution',
      content: `Executed ${step.skillType} with params: ${JSON.stringify(step.parameters)}`,
      result: JSON.stringify(result),
      timestamp: new Date().toISOString()
    };
    await this.vectorDB.insert(memoryRecord);
  }
}
