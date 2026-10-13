'use client'

import { useCallback, useEffect, useRef } from 'react'

const PROGRESS_INTERVAL_MS = 150
const TIMEOUT_MS = 10000

/**
 * Evento de início de navegação. A barra começa a andar quando ele é disparado em `window`; clique em
 * link interno já o dispara sozinho. Navegação programática (`navigate()`, `router.push`) dispara com
 * `dispatchNavigationStart`. No app de origem, quem disparava era o `useAppRouter`.
 */
export const NAVIGATION_START_EVENT = 'navigation:start'

export function dispatchNavigationStart(href?: string) {
    window.dispatchEvent(new CustomEvent(NAVIGATION_START_EVENT, { detail: { href } }))
}

export interface RouteProgressBarProps {
    /** Rota atual. No app de origem, vinha do `usePathname`; a barra termina quando ela muda. */
    pathname: string
}

export default function RouteProgressBar({ pathname }: RouteProgressBarProps) {
    const prevPathname = useRef(pathname)
    const timerRef = useRef<ReturnType<typeof setInterval>>(undefined)
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)
    const isNavigating = useRef(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const barRef = useRef<HTMLDivElement>(null)
    const progressRef = useRef(0)

    const resetBar = useCallback(() => {
        isNavigating.current = false
        progressRef.current = 0
        if (timerRef.current) clearInterval(timerRef.current)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (containerRef.current) containerRef.current.style.display = 'none'
        if (barRef.current) barRef.current.style.width = '0%'
    }, [])

    const startProgress = useCallback(() => {
        if (isNavigating.current) return
        isNavigating.current = true
        progressRef.current = 0

        if (containerRef.current) containerRef.current.style.display = 'block'
        if (barRef.current) barRef.current.style.width = '0%'

        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = setInterval(() => {
            progressRef.current += Math.random() * 10 + 2
            if (progressRef.current > 90) progressRef.current = 90
            if (barRef.current) barRef.current.style.width = `${progressRef.current}%`
        }, PROGRESS_INTERVAL_MS)

        // Timeout de recovery — evita barra travada indefinidamente
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(resetBar, TIMEOUT_MS)
    }, [resetBar])

    const finishProgress = useCallback(() => {
        if (!isNavigating.current) return
        isNavigating.current = false
        if (timerRef.current) clearInterval(timerRef.current)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)

        if (barRef.current) barRef.current.style.width = '100%'
        setTimeout(() => {
            if (containerRef.current) containerRef.current.style.display = 'none'
            if (barRef.current) barRef.current.style.width = '0%'
            progressRef.current = 0
        }, 300)
    }, [])

    // Detectar clique em links internos (<Link> e <a> tags)
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest('a')
            if (!anchor) return

            const href = anchor.getAttribute('href')
            if (!href || href.startsWith('http') || href.startsWith('#') || anchor.target === '_blank') return

            const targetPath = href.split('?')[0]
            if (targetPath !== pathname) {
                window.dispatchEvent(new CustomEvent('navigation:start', { detail: { href } }))
                startProgress()
            }
        }

        document.addEventListener('click', handleClick, true)
        return () => document.removeEventListener('click', handleClick, true)
    }, [pathname, startProgress])

    // Escutar evento customizado de navegação programática (useAppRouter)
    useEffect(() => {
        const handleNavigationStart = () => startProgress()
        window.addEventListener('navigation:start', handleNavigationStart)
        return () => window.removeEventListener('navigation:start', handleNavigationStart)
    }, [startProgress])

    // Quando o pathname muda, a navegação completou
    useEffect(() => {
        if (pathname !== prevPathname.current) {
            if (!isNavigating.current) {
                // router.push sem useAppRouter (fallback) — flash rápido
                if (containerRef.current) containerRef.current.style.display = 'block'
                if (barRef.current) barRef.current.style.width = '100%'
                setTimeout(() => {
                    if (containerRef.current) containerRef.current.style.display = 'none'
                    if (barRef.current) barRef.current.style.width = '0%'
                }, 300)
            } else {
                finishProgress()
            }
            prevPathname.current = pathname
        }
    }, [pathname, finishProgress])

    return (
        <div ref={containerRef} className="fixed top-0 left-0 right-0 z-9999 h-1" style={{ display: 'none' }}>
            <div
                ref={barRef}
                className="h-full bg-accent shadow-sm shadow-accent/50 transition-all duration-200 ease-out"
                style={{ width: '0%' }}
            />
        </div>
    )
}
