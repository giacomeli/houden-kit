'use client'

import type React from 'react'
import { useLayoutEffect, useRef } from 'react'

export interface ChatMessageListProps {
    children: React.ReactNode
    /** Padrão: "Mensagens". */
    'aria-label'?: string
    /** Distância do fim, em pixels, em que a lista ainda acompanha mensagens novas. Padrão: 80. */
    stickToBottomThreshold?: number
    className?: string
}

/**
 * Lista rolável de mensagens. Acompanha o fim quando chega mensagem nova, mas só se o usuário já estava
 * perto do fim: quem rolou para ler o histórico não é puxado de volta.
 */
const ChatMessageList: React.FC<ChatMessageListProps> = ({
    children,
    'aria-label': ariaLabel = 'Mensagens',
    stickToBottomThreshold = 80,
    className = '',
}) => {
    const listRef = useRef<HTMLDivElement>(null)
    const nearBottom = useRef(true)

    // biome-ignore lint/correctness/useExhaustiveDependencies: rola de novo a cada mudança das mensagens
    useLayoutEffect(() => {
        const el = listRef.current
        if (el && nearBottom.current) el.scrollTop = el.scrollHeight
    }, [children])

    return (
        <div
            ref={listRef}
            role="log"
            aria-live="polite"
            aria-label={ariaLabel}
            onScroll={(event) => {
                const el = event.currentTarget
                nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight <= stickToBottomThreshold
            }}
            className={`flex flex-col gap-1 overflow-y-auto ${className}`}
        >
            {children}
        </div>
    )
}

export default ChatMessageList
