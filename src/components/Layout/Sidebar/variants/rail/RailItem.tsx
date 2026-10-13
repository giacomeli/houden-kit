'use client'

import React from 'react'
import type { IMenuSection } from '../../../../../types/menu'
import Tooltip from '../../../Tooltip'

/** Id do painel contextual, referenciado por `aria-controls` em cada botão do trilho. */
export const ID_PAINEL = 'sidebar-painel-contextual'

const TAMANHO_ICONE = 22
const TRACO_ICONE = 1.75

interface RailItemProps {
    area: IMenuSection
    /** A rota atual pertence a esta área. */
    ativa: boolean
    /** O painel desta área está aberto. */
    aberta: boolean
    onSelecionar: () => void
}

/**
 * Botão de área no trilho.
 *
 * O alvo tem 44 px, mínimo recomendado para toque, o que importa para o empacotamento com Capacitor.
 * O tooltip não é enfeite: com o painel fechado o rótulo não aparece em lugar nenhum.
 *
 * `aria-current` usa `true`, não `page`: a área contém a página atual, mas não é ela. O `page` fica
 * para o item do painel, que aponta para a rota de fato.
 */
const RailItem: React.FC<RailItemProps> = ({ area, ativa, aberta, onSelecionar }) => {
    const Icone = area.icon

    if (!Icone) return null

    const nome = area.label ?? area.id

    return (
        <Tooltip text={nome} className="tooltip-right">
            <button
                type="button"
                onClick={onSelecionar}
                aria-label={nome}
                aria-expanded={aberta}
                aria-controls={ID_PAINEL}
                aria-current={ativa ? 'true' : undefined}
                className={`relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                    ativa ? 'bg-accent/15 text-accent' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
            >
                {ativa && (
                    <span
                        aria-hidden="true"
                        className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-accent"
                    />
                )}
                <Icone size={TAMANHO_ICONE} strokeWidth={TRACO_ICONE} />
            </button>
        </Tooltip>
    )
}

export default RailItem
