'use client'

import { SendHorizontal } from 'lucide-react'
import type React from 'react'
import { useLayoutEffect, useRef, useState } from 'react'
import { iconDefaults } from '../../../icons/defaults'

// Mesmos limites do ChatInput do app de origem: cresce com o conteúdo e depois rola internamente.
const MIN_TEXTAREA_HEIGHT_PX = 32
const MAX_TEXTAREA_HEIGHT_PX = 160

export interface ChatComposerProps {
    onSend: (message: string) => void | Promise<void>
    /** Padrão: "Digite uma mensagem". */
    placeholder?: string
    disabled?: boolean
    /** Mostra o carregamento no botão e bloqueia novos envios. */
    isSending?: boolean
    className?: string
}

/**
 * Campo de envio do chat. Enter envia e Shift+Enter quebra linha, como o `handleKeyDown` do ChatInput do
 * app de origem; Enter durante a composição de um IME (acentos, por exemplo) não envia.
 */
const ChatComposer: React.FC<ChatComposerProps> = ({
    onSend,
    placeholder = 'Digite uma mensagem',
    disabled = false,
    isSending = false,
    className = '',
}) => {
    const [value, setValue] = useState('')
    const textAreaRef = useRef<HTMLTextAreaElement>(null)
    const canSend = !disabled && !isSending && value.trim().length > 0

    // A altura é ajustada pelo CSSOM (`element.style`), que a CSP sem `unsafe-inline` permite.
    // biome-ignore lint/correctness/useExhaustiveDependencies: recalcula a cada mudança do texto
    useLayoutEffect(() => {
        const el = textAreaRef.current
        if (!el) return
        el.style.height = 'auto'
        const nextHeight = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT_PX)
        el.style.height = `${Math.max(nextHeight, MIN_TEXTAREA_HEIGHT_PX)}px`
        el.style.overflowY = el.scrollHeight > MAX_TEXTAREA_HEIGHT_PX ? 'auto' : 'hidden'
    }, [value])

    const send = () => {
        if (!canSend) return
        const message = value.trim()
        setValue('')
        void onSend(message)
    }

    return (
        <form
            className={`flex items-end gap-2 ${className}`}
            onSubmit={(event) => {
                event.preventDefault()
                send()
            }}
        >
            <textarea
                ref={textAreaRef}
                rows={1}
                value={value}
                placeholder={placeholder}
                aria-label={placeholder}
                disabled={disabled}
                className="flex-1 textarea min-h-8 py-1 leading-6 resize-none overflow-hidden"
                onChange={(event) => setValue(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
                        event.preventDefault()
                        send()
                    }
                }}
            />
            <button
                type="submit"
                aria-label="Enviar mensagem"
                disabled={!canSend}
                className="btn btn-sm btn-square btn-ghost text-primary bg-white dark:bg-base-300 dark:text-base-content"
            >
                {isSending ? (
                    <span className="loading loading-spinner loading-xs" />
                ) : (
                    <SendHorizontal {...iconDefaults} className="text-lg" />
                )}
            </button>
        </form>
    )
}

export default ChatComposer
