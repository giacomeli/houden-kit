import type { LucideIcon } from 'lucide-react'

/**
 * Item do menu lateral. Equivalente ao `IMenuItem` de `src/config/sidebarMenu.ts` do app de origem, sem a
 * regra de acesso (`access`): na lib, o app entrega o menu já filtrado por permissão. O tipo do app de origem
 * continua atribuível a este.
 */
export interface IMenuItem {
    id: string
    label: string
    searchTerms: string[]
    href?: string
    icon?: LucideIcon
    target?: string
    children?: IMenuItem[]
}

/** Seção (área) do menu lateral. Equivalente ao `IMenuSection` do app de origem, sem `access`. */
export interface IMenuSection {
    id: string
    label?: string
    showDivider?: boolean
    /**
     * Ícone da área no trilho da variante `rail`. A variante `legacy` não usa: lá a seção aparece
     * como divisor com o rótulo no meio da linha.
     */
    icon?: LucideIcon
    items: IMenuItem[]
}
