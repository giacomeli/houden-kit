// O menu do app de origem (com a regra de acesso) continua atribuível ao tipo da lib. Cópia literal dos
// tipos de `src/config/sidebarMenu.ts` no commit-base.
import type { LucideIcon } from 'lucide-react'
import type { IMenuItem, IMenuSection } from '../../src/types/menu'

interface SourceMenuAccessRule {
    anyOfGrants?: string[]
    allOfGrants?: string[]
    anyOfRoles?: string[]
    anyOfModules?: string[]
    public?: boolean
}

interface SourceMenuItem {
    id: string
    label: string
    searchTerms: string[]
    href?: string
    icon?: LucideIcon
    target?: string
    access: SourceMenuAccessRule
    children?: SourceMenuItem[]
}

interface SourceMenuSection {
    id: string
    label?: string
    showDivider?: boolean
    icon?: LucideIcon
    access: SourceMenuAccessRule
    items: SourceMenuItem[]
}

describe('tipos de menu', () => {
    it('IMenuItem e IMenuSection do app de origem são atribuíveis aos da lib', () => {
        expectTypeOf<SourceMenuItem>().toExtend<IMenuItem>()
        expectTypeOf<SourceMenuSection>().toExtend<IMenuSection>()
        expectTypeOf<SourceMenuSection[]>().toExtend<IMenuSection[]>()
    })
})
