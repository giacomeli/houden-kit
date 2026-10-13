'use client'

import React, { useEffect, useRef } from 'react'
import { useLoaderStore } from './loaderStore'

/**
 * Overlay bloqueante das mutações com `meta.showLoader` (ver `attachLoaderInterceptors`).
 *
 * Só o `useLoaderStore` o controla. Ele já reagiu a `navigation:start` para escurecer a tela em
 * toda navegação, e isso fazia um clique de 80 ms parecer tela travada (achado B1 da auditoria de
 * performance); o feedback de navegação é só a `RouteProgressBar`. Escreve direto no DOM via ref
 * para não re-renderizar a árvore a cada request.
 */
const Loader: React.FC = React.memo(function Loader() {
    const loading = useLoaderStore((s) => s.loading)
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!containerRef.current) return
        containerRef.current.style.display = loading ? 'flex' : 'none'
        containerRef.current.style.pointerEvents = loading ? 'auto' : 'none'
    }, [loading])

    return (
        <div
            ref={containerRef}
            id="loader"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/20"
            style={{ display: 'none', pointerEvents: 'none' }}
        >
            <span className="loading loading-spinner text-accent loading-lg"></span>
        </div>
    )
})

export default Loader
