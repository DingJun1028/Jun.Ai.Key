// 知識擷取奧義（Knowledge Extraction Mastery）
export interface KnowledgeSnippet {
  id: string;
  content: string;
  source: string;
  extractedAt: string;
}

export class KnowledgeExtractor {
  private snippets: KnowledgeSnippet[] = [];

  extract(content: string, source: string): KnowledgeSnippet {
    const snippet: KnowledgeSnippet = {
      id: `ks_${Date.now()}`,
      content,
      source,
      extractedAt: new Date().toISOString()
    };
    this.snippets.push(snippet);
    return snippet;
  }

  getAllSnippets(): KnowledgeSnippet[] {
    return this.snippets;
  }
}
