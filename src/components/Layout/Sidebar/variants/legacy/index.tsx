'use client'

import React, { useState } from 'react'
import { renderSlot } from '../../../../../types/navigation'
import Aside from '../../../Aside'
import UlMenu from '../../../UlMenu'
import { useSidebarContext } from '../../useSidebarContext'
import SidebarMenu from './SidebarMenu'

/**
 * Variante legada: a barra como ela sempre foi, agora alimentada pelo contexto em vez de chamar os
 * hooks por conta própria. O layout e o comportamento não mudaram — ela é o controle da comparação
 * com a variante de trilho, e qualquer diferença visual aqui é defeito.
 *
 * O `isHovered` continua local porque é comportamento desta variante: em `/vendas/conversas` a
 * barra encolhe e só expande com o ponteiro em cima.
 */
const SidebarLegacy: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false)
    const { filteredMenu, searchTerm, setSearchTerm, logo, userProfile, isCollapsed } = useSidebarContext()

    // No app de origem, `isTicketDetailPage` (rota `/vendas/conversas`); na lib, a prop `isCollapsed`.
    const isSidebarFullWidth = isCollapsed ? isHovered : true
    const widthClass = isSidebarFullWidth ? 'min-w-[200px] max-w-[200px]' : 'min-w-[70px] max-w-[70px]'

    return (
        <Aside
            className={`z-50 transition-all duration-300 h-screen bg-primary sticky top-0 w-full ${widthClass} flex flex-col`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <UlMenu className="w-full space-y-2 bg-primary [&_a]:!text-white text-white flex-1 min-h-0 overflow-y-auto overflow-x-hidden flex-nowrap">
                <div className="flex items-center justify-center w-full shrink-0 sticky top-0 bg-primary z-50 py-4 px-2">
                    <div
                        className={`overflow-hidden transition-all duration-300 ${
                            isSidebarFullWidth ? 'max-w-[100px]' : 'max-w-[38px]'
                        }`}
                    >
                        {renderSlot(logo, { compact: !isSidebarFullWidth })}
                    </div>
                </div>

                {isSidebarFullWidth && (
                    <input
                        type="text"
                        placeholder="Buscar menu..."
                        className="input input-xs mt-4 w-full shrink-0 text-black dark:text-white dark:bg-secondary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                )}

                {filteredMenu.map((section) => (
                    <React.Fragment key={section.id}>
                        {section.showDivider && (
                            <div className="divider divider-neutral text-xs text-neutral">
                                {isSidebarFullWidth ? section.label : ''}
                            </div>
                        )}
                        <SidebarMenu
                            items={section.items}
                            isSidebarFullWidth={isSidebarFullWidth}
                            isSearching={searchTerm.length > 0}
                        />
                    </React.Fragment>
                ))}
            </UlMenu>

            {renderSlot(userProfile, { isSidebarFullWidth })}
        </Aside>
    )
}

export default SidebarLegacy
