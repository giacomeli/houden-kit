import type React from 'react'
import MessageTimestamp from '../MessageTimestamp'

export interface ChatBubbleProps {
    /** `end` para as mensagens do próprio usuário, `start` para as do outro lado (o agente). */
    side: 'start' | 'end'
    children: React.ReactNode
    author?: string
    /** Avatar ao lado da bolha (`chat-image` do DaisyUI). */
    avatar?: React.ReactNode
    /** Data ISO da mensagem, mostrada pelo MessageTimestamp. */
    timestamp?: string
    /** Conteúdo extra no rodapé da bolha, antes da hora (status de entrega, por exemplo). */
    footer?: React.ReactNode
    /** Anima a entrada (`message-new`), para a mensagem que acabou de chegar. */
    isNew?: boolean
    className?: string
}

/**
 * Bolha de mensagem com as classes do chat do app de origem (`MessageList/MessageBubble`): `chat chat-end`
 * com `bg-emerald-200` do próprio lado, `chat chat-start` com `bg-base-300` do outro. O texto do outro lado
 * usa `text-base-content` (no app de origem, `text-gray-700`, que some no tema escuro).
 */
const ChatBubble: React.FC<ChatBubbleProps> = ({
    side,
    children,
    author,
    avatar,
    timestamp,
    footer,
    isNew = false,
    className = '',
}) => {
    const isOwnSide = side === 'end'

    return (
        <div
            className={`p-1 text-sm chat ${isOwnSide ? 'chat-end' : 'chat-start'} ${isNew ? 'message-new' : ''} ${className}`}
        >
            {avatar && <div className="chat-image">{avatar}</div>}
            <div
                className={`chat-bubble flex flex-col gap-1 max-w-[70%] break-words ${
                    isOwnSide ? 'bg-emerald-200 text-gray-800' : 'bg-base-300 text-base-content'
                }`}
            >
                {author && <p className={`text-xs font-bold ${isOwnSide ? 'text-end' : 'text-start'}`}>{author}</p>}
                <div>{children}</div>
                {(footer || timestamp) && (
                    <div className="flex items-center justify-end gap-1">
                        {footer}
                        {timestamp && <MessageTimestamp createdAt={timestamp} />}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatBubble
