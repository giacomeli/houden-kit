'use client'

import { ChevronDown, ChevronRight } from 'lucide-react'
import React, { useState } from 'react'
import type { IMenuItem } from '../../../../../types/menu'
import { useLinkComponent } from '../../useLinkComponent'

const TAMANHO_ICONE = 18
const TRACO_ICONE = 1.75
const RECUO_POR_NIVEL = 12

interface PanelItemProps {
    item: IMenuItem
    itemAtivoId: string | null
    onNavegar: () => void
    nivel?: number
}

const classeBase =
    'flex h-[38px] w-full items-center gap-2 rounded-lg px-2 text-sm transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

/**
 * Item do painel: link para uma rota ou pai que expande filhos.
 *
 * A expansão é estado do React, não `details`/`summary` como na variante legada. Dentro do painel o
 * pai precisa saber se contém a rota atual e se há busca ativa, e o elemento nativo não aceita ser
 * controlado sem brigar com o próprio comportamento.
 */
const PanelItem: React.FC<PanelItemProps> = ({ item, itemAtivoId, onNavegar, nivel = 0 }) => {
    // Tudo nasce expandido: o painel é transitório, e acordeão recolhido aqui cobraria um clique só
    // para revelar o destino. Recolher continua possível, mas é escolha de quem usa, não o padrão,
    // e não persiste — reabrir a área devolve a lista inteira à vista.
    const [expandido, setExpandido] = useState(true)
    const Link = useLinkComponent()
    const Icone = item.icon
    const recuo = nivel * RECUO_POR_NIVEL

    if (item.children && item.children.length > 0) {
        const Seta = expandido ? ChevronDown : ChevronRight

        return (
            <li>
                <button
                    type="button"
                    onClick={() => setExpandido((atual) => !atual)}
                    aria-expanded={expandido}
                    className={`${classeBase} text-white/75 hover:bg-white/10 hover:text-white`}
                    style={{ paddingLeft: 8 + recuo }}
                >
                    {Icone && <Icone size={TAMANHO_ICONE} strokeWidth={TRACO_ICONE} className="shrink-0" />}
                    <span className="flex-1 truncate text-left">{item.label}</span>
                    <Seta size={14} strokeWidth={TRACO_ICONE} className="shrink-0 opacity-60" />
                </button>

                {expandido && (
                    <ul className="flex flex-col gap-0.5">
                        {item.children.map((filho) => (
                            <PanelItem
                                key={filho.id}
                                item={filho}
                                itemAtivoId={itemAtivoId}
                                onNavegar={onNavegar}
                                nivel={nivel + 1}
                            />
                        ))}
                    </ul>
                )}
            </li>
        )
    }

    if (!item.href) return null

    const ativo = item.id === itemAtivoId

    return (
        <li>
            <Link
                href={item.href}
                target={item.target}
                onClick={onNavegar}
                aria-current={ativo ? 'page' : undefined}
                className={`${classeBase} ${
                    ativo ? 'bg-accent text-accent-content' : 'text-white/75 hover:bg-white/10 hover:text-white'
                }`}
                style={{ paddingLeft: 8 + recuo }}
            >
                {Icone ? (
                    <Icone size={TAMANHO_ICONE} strokeWidth={TRACO_ICONE} className="shrink-0" />
                ) : (
                    nivel > 0 && (
                        <span
                            aria-hidden="true"
                            className={`ml-1 h-[5px] w-[5px] shrink-0 rounded-full ${
                                ativo ? 'bg-accent-content' : 'bg-current opacity-50'
                            }`}
                        />
                    )
                )}
                <span className="truncate">{item.label}</span>
            </Link>
        </li>
    )
}

export default PanelItem
