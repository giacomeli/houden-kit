'use client'

import React from 'react'
import { SidebarProvider, type SidebarProviderProps } from './SidebarProvider'
import { useSidebarContext } from './useSidebarContext'
import { type SidebarVariant, useSidebarVariant } from './useSidebarVariant'
import SidebarLegacy from './variants/legacy'
import SidebarRail from './variants/rail'

/**
 * Resolve qual variante desenhar. Fica dentro do provider porque precisa saber se a rota atual
 * esconde a barra, informação que vive na camada compartilhada.
 */
const VarianteDaBarra: React.FC<{ variant?: SidebarVariant; defaultVariant?: SidebarVariant }> = ({
    variant,
    defaultVariant,
}) => {
    const preferida = useSidebarVariant(defaultVariant)
    const variante = variant ?? preferida
    const { isHidden } = useSidebarContext()

    if (isHidden) return null

    switch (variante) {
        case 'rail':
            return <SidebarRail />
        default:
            return <SidebarLegacy />
    }
}

export interface SidebarProps extends Omit<SidebarProviderProps, 'children'> {
    /** Variante fixa. Sem ela, vale o `useSidebarVariant` (parâmetro `?sidebar=` e escolha salva). */
    variant?: SidebarVariant
    /** Variante padrão quando não há escolha na URL nem salva. Padrão: `legacy`. */
    defaultVariant?: SidebarVariant
}

/**
 * Navegação lateral.
 *
 * Ela não desenha barra nenhuma: monta a camada compartilhada (menu já filtrado por permissão pelo
 * app, busca, rota, painel) e delega o desenho a uma variante. As variantes são apresentação pura, o
 * que permite acrescentar uma terceira sem duplicar regra.
 */
const Sidebar: React.FC<SidebarProps> = ({ variant, defaultVariant, ...props }) => (
    <SidebarProvider {...props}>
        <VarianteDaBarra variant={variant} defaultVariant={defaultVariant} />
    </SidebarProvider>
)

export default Sidebar
