/**
 * 符文嵌合系統（Rune Engraving System）
 * 用於創建與管理符文物件。
 */
export interface Rune {
  id: string;
  name: string;
  effect: string;
  engravedAt: string;
}

export class RuneEngravingSystem {
  private runes: Rune[] = [];

  /**
   * 創建一個新的符文
   * @param name 符文名稱
   * @param effect 符文效果
   * @returns Rune 符文物件
   */
  engraveRune(name: string, effect: string): Rune {
    const rune: Rune = {
      id: `rune_${Date.now()}`,
      name,
      effect,
      engravedAt: new Date().toISOString()
    };
    this.runes.push(rune);
    return rune;
  }

  /**
   * 取得所有符文
   * @returns Rune[]
   */
  getAllRunes(): Rune[] {
    return this.runes;
  }
}
