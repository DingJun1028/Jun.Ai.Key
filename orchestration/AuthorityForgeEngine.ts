/**
 * 權能冶煉引擎（Authority Forge Engine）
 * 用於創建與管理權限物件。
 */
export interface Authority {
  id: string;
  type: string;
  permissions: string[];
  createdAt: string;
}

export class AuthorityForgeEngine {
  private authorities: Authority[] = [];

  /**
   * 創建一個新的權限物件
   * @param type 權限類型
   * @param permissions 權限清單
   * @returns Authority 權限物件
   */
  forgeAuthority(type: string, permissions: string[]): Authority {
    const authority: Authority = {
      id: `auth_${Date.now()}`,
      type,
      permissions,
      createdAt: new Date().toISOString()
    };
    this.authorities.push(authority);
    return authority;
  }

  /**
   * 取得所有權限物件
   * @returns Authority[]
   */
  getAllAuthorities(): Authority[] {
    return this.authorities;
  }
}
