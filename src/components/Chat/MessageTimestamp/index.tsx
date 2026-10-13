'use client'

import React, { useMemo, useState } from 'react'

export type MessageTimestampProps = { createdAt: string }

const MessageTimestamp: React.FC<MessageTimestampProps> = ({ createdAt }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const { shortTime, fullDateTime } = useMemo(() => {
        const date = new Date(createdAt)
        return {
            shortTime: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            fullDateTime: date.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }),
        }
    }, [createdAt])

    const handleClick = () => setIsExpanded((prev) => !prev)

    return (
        <time className="text-[10px] self-end opacity-50 cursor-pointer" onClick={handleClick}>
            {isExpanded ? fullDateTime : shortTime}
        </time>
    )
}

export default MessageTimestamp
