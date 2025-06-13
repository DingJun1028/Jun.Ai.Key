const { AuthorityForgeEngine } = require('./AuthorityForgeEngine')

describe('AuthorityForgeEngine', () => {
  it('should forge a new authority', () => {
    const engine = new AuthorityForgeEngine()
    const auth = engine.forgeAuthority('admin', ['read', 'write'])
    expect(auth.type).toBe('admin')
    expect(auth.permissions).toContain('read')
    expect(engine.getAllAuthorities().length).toBe(1)
  })

  it('should get authority by id', () => {
    const engine = new AuthorityForgeEngine()
    const auth = engine.forgeAuthority('user', ['read'])
    const found = engine.getAuthorityById(auth.id)
    expect(found).toBeDefined()
    expect(found.type).toBe('user')
  })

  it('should remove authority', () => {
    const engine = new AuthorityForgeEngine()
    const auth = engine.forgeAuthority('user', ['read'])
    const removed = engine.removeAuthority(auth.id)
    expect(removed).toBe(true)
    expect(engine.getAllAuthorities().length).toBe(0)
  })

  it('should forge a module from multiple authorities', () => {
    const engine = new AuthorityForgeEngine()
    const a1 = engine.forgeAuthority('a', ['x', 'y'])
    const a2 = engine.forgeAuthority('b', ['y', 'z'])
    const module = engine.forgeModule([a1.id, a2.id], 'module')
    expect(module.type).toBe('module')
    expect(module.permissions.sort()).toEqual(['x', 'y', 'z'])
  })
})
