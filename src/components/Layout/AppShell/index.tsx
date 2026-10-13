'use client'

import type React from 'react'
import RouteProgressBar from '../RouteProgressBar'

export interface AppShellProps {
    children: React.ReactNode
    /** Navegação lateral, normalmente a `Sidebar`. */
    sidebar?: React.ReactNode
    /** Rota atual, repassada ao RouteProgressBar. */
    pathname: string
    /**
     * Tela de altura fixa (`h-screen overflow-hidden`), para telas de conversa em que a página não pode
     * rolar. No app de origem, eram as rotas de conversa e do chatbot.
     */
    fullHeight?: boolean
}

/**
 * Estrutura do layout autenticado do app de origem (`src/app/(auth)/layout.tsx`), sem sessão, WebSocket
 * nem guarda de rota: barra de progresso, navegação lateral e a área de conteúdo.
 */
const AppShell: React.FC<AppShellProps> = ({ children, sidebar, pathname, fullHeight = false }) => {
    return (
        <div className="relative flex flex-row darkTarget">
            <RouteProgressBar pathname={pathname} />
            {sidebar}
            <div className="w-full min-w-0 bg-base-100 dark:bg-neutral/90 ">
                <div className={`${fullHeight ? 'h-screen overflow-hidden' : 'p-0'}`}>
                    {!fullHeight && <div className="flex flex-row-reverse text-2xl"></div>}
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AppShell
