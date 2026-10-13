'use client'

import React, { createContext, useCallback, useMemo, useState } from 'react'
import type { IMenuSection } from '../../../types/menu'
import type { LinkComponent, Slot } from '../../../types/navigation'
import Logo from '../Logo'
import { filterMenuBySearch } from './filterMenuBySearch'

export interface SidebarContextValue {
    /** Menu filtrado por permissão (pelo app) e por busca. Alimenta a lista de itens. */
    filteredMenu: IMenuSection[]
    /**
     * Menu filtrado **apenas** por permissão, sem a busca.
     *
     * Existe porque buscar item não pode apagar área: são níveis diferentes de navegação. Quando o
     * trilho e o painel liam só o `filteredMenu`, um termo sem correspondência esvaziava a lista, o
     * painel não encontrava a área aberta e desmontava — levando junto o campo de busca que estava
     * dentro dele, sem deixar como limpar o termo a não ser recarregando a página.
     */
    menuPorAcesso: IMenuSection[]
    /** Rota atual. Exposta aqui para nenhuma variante precisar chamar `usePathname` por conta. */
    pathname: string
    searchTerm: string
    setSearchTerm: (termo: string) => void
    /** A rota atual esconde a barra inteira. */
    isHidden: boolean
    /** Área cujo painel contextual está aberto, ou null. Usado apenas pela variante de trilho. */
    areaAberta: string | null
    /** Abre a área; chamar com a área já aberta fecha o painel. */
    alternarArea: (id: string) => void
    fecharPainel: () => void
    /** Componente de link interno. No app de origem, era o `next/link`. */
    linkComponent: LinkComponent
    /** Slot do logo. A variante informa se quer a forma compacta. */
    logo: Slot<{ compact: boolean }>
    /** Slot do perfil do usuário, no rodapé da barra. A variante informa se a barra está expandida. */
    userProfile?: Slot<{ isSidebarFullWidth: boolean }>
    /** A barra fica recolhida e só expande com o ponteiro em cima (variante `legacy`). */
    isCollapsed: boolean
}

export const SidebarContext = createContext<SidebarContextValue | undefined>(undefined)

export interface SidebarProviderProps {
    children: React.ReactNode
    /** Menu já filtrado por permissão pelo app. A lib só aplica a busca. */
    menu: IMenuSection[]
    /** Rota atual. No app de origem, vinha do `usePathname`. */
    pathname: string
    /** Padrão: `'a'`. */
    linkComponent?: LinkComponent
    /** Padrão: o `Logo` em texto da lib. */
    logo?: Slot<{ compact: boolean }>
    userProfile?: Slot<{ isSidebarFullWidth: boolean }>
    /** Esconde a barra inteira. No app de origem, eram as telas de impressão e de relatório em tela cheia. */
    isHidden?: boolean
    /** Barra recolhida, que expande com o ponteiro em cima. No app de origem, era a tela de conversas. */
    isCollapsed?: boolean
}

const logoPadrao = ({ compact }: { compact: boolean }) => <Logo compact={compact} />

/**
 * Camada compartilhada da navegação lateral.
 *
 * A `Sidebar` concentra dados, estado e regras, e as variantes apenas desenham. No app de origem, era
 * aqui que a regra de acesso (`useSidebarMenu.checkAccess`) rodava; na lib, o app entrega o menu já
 * filtrado, e a camada aplica só a busca.
 */
export function SidebarProvider({
    children,
    menu,
    pathname,
    linkComponent = 'a',
    logo = logoPadrao,
    userProfile,
    isHidden = false,
    isCollapsed = false,
}: SidebarProviderProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [areaAberta, setAreaAberta] = useState<string | null>(null)

    const filteredMenu = useMemo(() => filterMenuBySearch(menu, searchTerm), [menu, searchTerm])
    // Termo fixo em vazio: só recalcula quando o menu muda, não a cada tecla digitada.
    const menuPorAcesso = useMemo(() => filterMenuBySearch(menu, ''), [menu])

    const alternarArea = useCallback((id: string) => {
        setAreaAberta((atual) => (atual === id ? null : id))
    }, [])

    const fecharPainel = useCallback(() => setAreaAberta(null), [])

    // Sem o memo, todo consumidor do contexto re-renderiza a cada tecla digitada na busca.
    const valor = useMemo<SidebarContextValue>(
        () => ({
            filteredMenu,
            menuPorAcesso,
            pathname,
            searchTerm,
            setSearchTerm,
            isHidden,
            areaAberta,
            alternarArea,
            fecharPainel,
            linkComponent,
            logo,
            userProfile,
            isCollapsed,
        }),
        [
            filteredMenu,
            menuPorAcesso,
            pathname,
            searchTerm,
            isHidden,
            areaAberta,
            alternarArea,
            fecharPainel,
            linkComponent,
            logo,
            userProfile,
            isCollapsed,
        ],
    )

    return <SidebarContext.Provider value={valor}>{children}</SidebarContext.Provider>
}
