'use client'

import React from 'react'
import { renderSlot } from '../../../../../types/navigation'
import Aside from '../../../Aside'
import { useActiveMenuItem } from '../../useActiveMenuItem'
import { useSidebarContext } from '../../useSidebarContext'
import RailItem from './RailItem'

/** 44 px de alvo mais 14 px de folga de cada lado. Múltiplo de 4, como a escala do Tailwind. */
export const LARGURA_TRILHO = 72

/**
 * Trilho permanente de áreas.
 *
 * Diferente da variante legada, a largura não muda por rota: o rótulo vive no painel, e barra que
 * muda de tamanho conforme a tela quebra a memória espacial de quem usa o sistema o dia inteiro.
 */
const RailBar: React.FC = () => {
    // `menuPorAcesso` e não `filteredMenu`: buscar item não remove área do trilho.
    const { menuPorAcesso, areaAberta, alternarArea, logo, userProfile } = useSidebarContext()
    const { areaAtivaId } = useActiveMenuItem(menuPorAcesso)

    return (
        <Aside
            data-trilho="true"
            className="sticky top-0 z-50 flex h-screen shrink-0 flex-col items-center gap-1 bg-primary py-4"
            style={{ width: LARGURA_TRILHO, minWidth: LARGURA_TRILHO }}
        >
            <div className="mb-2 flex h-10 w-10 items-center justify-center">{renderSlot(logo, { compact: true })}</div>

            <nav aria-label="Áreas do sistema" className="flex flex-col items-center gap-1">
                {menuPorAcesso.map((area) => (
                    <RailItem
                        key={area.id}
                        area={area}
                        ativa={area.id === areaAtivaId}
                        aberta={area.id === areaAberta}
                        onSelecionar={() => alternarArea(area.id)}
                    />
                ))}
            </nav>

            <div className="mt-auto w-full">{renderSlot(userProfile, { isSidebarFullWidth: false })}</div>
        </Aside>
    )
}

export default RailBar
