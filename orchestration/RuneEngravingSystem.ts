// 符文嵌合系統（Rune Engraving System）
export interface Rune {
  id: string;
  name: string;
  effect: string;
  engravedAt: string;
}

export class RuneEngravingSystem {
  private runes: Rune[] = [];

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

  getAllRunes(): Rune[] {
    return this.runes;
  }
}
