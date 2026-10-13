'use client'

import React from 'react'
import type { IMenuItem } from '../../../../../types/menu'
import LiMenu from '../../../LiMenu'
import { useLinkComponent } from '../../useLinkComponent'

interface SidebarMenuProps {
    items: IMenuItem[]
    isSidebarFullWidth: boolean
    isSearching: boolean
}

/**
 * O ícone do `lucide-react` recebe o tamanho por prop, em pixels, em vez de herdar do `font-size`
 * como fazia o SVG do FontAwesome — que por isso saía com 12px, o tamanho do `text-xs` do item.
 * Um pouco maior que o rótulo quando há rótulo, e maior ainda quando o ícone é o que se vê.
 */
const TAMANHO_ICONE_EXPANDIDO = 16
const TAMANHO_ICONE_COLAPSADO = 20

/** Traço das referências de desenho; o padrão do lucide (2) fica pesado demais em 16px. */
const TRACO_ICONE = 1.75

const tamanhoDoIcone = (isSidebarFullWidth: boolean): number =>
    isSidebarFullWidth ? TAMANHO_ICONE_EXPANDIDO : TAMANHO_ICONE_COLAPSADO

/**
 * Colapsada, o item precisa centralizar o ícone. `justify-center` sozinho não basta: o `menu` do
 * DaisyUI monta o item como grid de duas colunas com `gap: 8px` e `padding-inline: 12px`, e o
 * rótulo colapsado mantém coluna e gap — o conjunto centralizado ainda deixaria o ícone à esquerda.
 */
const classeDoItemColapsado = 'justify-center gap-0 px-0'

const SidebarMenuItem = React.memo(function SidebarMenuItem({
    item,
    isSidebarFullWidth,
    isSearching,
}: {
    item: IMenuItem
    isSidebarFullWidth: boolean
    isSearching: boolean
}) {
    // O ícone do menu é o próprio componente do lucide, então vira elemento aqui.
    const Icone = item.icon
    const Link = useLinkComponent()

    if (item.children && item.children.length > 0) {
        return (
            <LiMenu
                hasSubMenu
                isSidebarFullWidth={isSidebarFullWidth}
                parentName={item.label}
                parentIcon={
                    Icone ? (
                        <Icone
                            size={tamanhoDoIcone(isSidebarFullWidth)}
                            strokeWidth={TRACO_ICONE}
                            className="shrink-0"
                        />
                    ) : undefined
                }
                isOpen={isSearching}
            >
                {item.children.map((child) => (
                    <SidebarMenuItem
                        key={child.id}
                        item={child}
                        isSidebarFullWidth={isSidebarFullWidth}
                        isSearching={isSearching}
                    />
                ))}
            </LiMenu>
        )
    }

    if (item.href) {
        return (
            <LiMenu className="text-xs">
                <Link
                    className={`${Icone ? 'flex items-center' : ''} ${isSidebarFullWidth ? '' : classeDoItemColapsado}`}
                    href={item.href}
                    target={item.target}
                >
                    {Icone && (
                        <Icone
                            size={tamanhoDoIcone(isSidebarFullWidth)}
                            strokeWidth={TRACO_ICONE}
                            className="shrink-0"
                        />
                    )}
                    {Icone ? (
                        <span
                            className={`whitespace-nowrap overflow-hidden transition-all ${
                                isSidebarFullWidth
                                    ? 'opacity-100 max-w-[200px] pl-2 duration-200 delay-150'
                                    : 'opacity-0 max-w-0 pl-0 duration-100'
                            }`}
                        >
                            {item.label}
                        </span>
                    ) : (
                        item.label
                    )}
                </Link>
            </LiMenu>
        )
    }

    return null
})

const SidebarMenu = React.memo(function SidebarMenu({ items, isSidebarFullWidth, isSearching }: SidebarMenuProps) {
    return (
        <>
            {items.map((item) => (
                <SidebarMenuItem
                    key={item.id}
                    item={item}
                    isSidebarFullWidth={isSidebarFullWidth}
                    isSearching={isSearching}
                />
            ))}
        </>
    )
})

export default SidebarMenu
