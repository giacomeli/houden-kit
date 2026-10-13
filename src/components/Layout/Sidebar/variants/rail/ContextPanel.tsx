'use client'

import { X } from 'lucide-react'
import React from 'react'
import type { IMenuItem } from '../../../../../types/menu'
import { useActiveMenuItem } from '../../useActiveMenuItem'
import { useSidebarContext } from '../../useSidebarContext'
import PanelItem from './PanelItem'
import { LARGURA_TRILHO } from './RailBar'
import { ID_PAINEL } from './RailItem'

export const LARGURA_PAINEL = 260

/**
 * Painel contextual da área aberta.
 *
 * Sobrepõe o conteúdo em vez de ocupar largura permanente: trilho mais painel fixo somariam cerca de
 * 330 px de cromo, e as telas de chat já disputam largura com as colunas próprias delas.
 *
 * Monta só quando há área aberta — com o painel fechado não existe nada no DOM, o que também evita
 * pagar o render de todos os itens de todas as áreas.
 */
const ContextPanel: React.FC = () => {
    const { filteredMenu, menuPorAcesso, areaAberta, searchTerm, setSearchTerm, fecharPainel } = useSidebarContext()
    const { itemAtivoId } = useActiveMenuItem(menuPorAcesso)

    // A existência do painel depende do menu de acesso, nunca do filtrado pela busca: o campo de
    // busca mora aqui dentro, e um termo sem resultado desmontaria o próprio controle que o
    // produziu, deixando o termo preso no contexto sem como limpá-lo.
    const area = menuPorAcesso.find((secao) => secao.id === areaAberta)

    if (!area) return null

    const itens = filteredMenu.find((secao) => secao.id === areaAberta)?.items ?? []
    const semResultado = searchTerm.length > 0 && itens.length === 0

    return (
        <div
            id={ID_PAINEL}
            className="animate-slide-in-left fixed top-0 z-40 flex h-screen flex-col bg-secondary shadow-xl"
            style={{ left: LARGURA_TRILHO, width: LARGURA_PAINEL }}
        >
            <div className="flex items-center justify-between px-4 pb-2 pt-5">
                <h2 className="text-[13px] font-semibold uppercase tracking-wider text-white/60">{area.label}</h2>
                <button
                    type="button"
                    onClick={fecharPainel}
                    aria-label="Fechar painel"
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white/60 transition-colors cursor-pointer hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                    <X size={16} strokeWidth={1.75} />
                </button>
            </div>

            <div className="px-3 pb-2">
                <input
                    type="text"
                    placeholder="Buscar menu..."
                    className="input input-sm w-full bg-primary text-white placeholder:text-white/40"
                    value={searchTerm}
                    onChange={(evento) => setSearchTerm(evento.target.value)}
                />
            </div>

            <nav aria-label={area.label} className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
                {semResultado ? (
                    <div className="flex flex-col items-start gap-2 px-2 py-4">
                        <p className="text-sm text-white/60">Nenhum item encontrado.</p>
                        <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="text-sm text-accent underline-offset-2 transition-colors cursor-pointer hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                        >
                            Limpar busca
                        </button>
                    </div>
                ) : (
                    <ul className="flex flex-col gap-0.5">
                        {itens.map((item) => (
                            <PanelItem key={item.id} item={item} itemAtivoId={itemAtivoId} onNavegar={fecharPainel} />
                        ))}
                    </ul>
                )}
            </nav>
        </div>
    )
}

export default ContextPanel
