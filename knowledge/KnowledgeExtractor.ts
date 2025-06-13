/**
 * 知識擷取奧義（Knowledge Extraction Mastery）
 * 用於擷取、管理知識片段。
 */
export interface KnowledgeSnippet {
  id: string;
  content: string;
  source: string;
  extractedAt: string;
}

export class KnowledgeExtractor {
  private snippets: KnowledgeSnippet[] = []

  /**
   * 擷取一段知識片段
   * @param content 內容
   * @param source 來源
   * @returns KnowledgeSnippet
   */
  extract(content: string, source: string): KnowledgeSnippet {
    const snippet: KnowledgeSnippet = {
      id: `ks_${Date.now()}`,
      content,
      source,
      extractedAt: new Date().toISOString()
    }
    this.snippets.push(snippet)
    return snippet
  }

  /**
   * 取得所有知識片段
   * @returns KnowledgeSnippet[]
   */
  getAllSnippets(): KnowledgeSnippet[] {
    return this.snippets
  }
}
