// 權能冶煉引擎（Authority Forge Engine）
export interface Authority {
  id: string;
  type: string;
  permissions: string[];
  createdAt: string;
}

export class AuthorityForgeEngine {
  private authorities: Authority[] = [];

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

  getAllAuthorities(): Authority[] {
    return this.authorities;
  }
}
