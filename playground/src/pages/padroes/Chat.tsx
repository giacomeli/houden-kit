import { ChatBubble, ChatComposer, ChatMessageList, MarkdownContent, PageHeader } from 'houden-kit'
import { Bot } from 'houden-kit/icons'
import { useEffect, useRef, useState } from 'react'
import { conversaInicial, type Mensagem, respostaDoAgente } from '../../data/chat'

const avatarDoAgente = (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-content">
        <Bot size={16} strokeWidth={1.75} aria-hidden="true" />
    </div>
)

/** Padrão `chat`: conversa com o agente, resposta em Markdown chegando em partes. */
export default function Chat() {
    const [mensagens, setMensagens] = useState<Mensagem[]>(conversaInicial)
    const [respondendo, setRespondendo] = useState(false)
    const [novaId, setNovaId] = useState<number | null>(null)
    const timer = useRef<number | undefined>(undefined)

    useEffect(() => () => window.clearInterval(timer.current), [])

    const enviar = (texto: string) => {
        const agora = new Date().toISOString()
        const idUsuario = Date.now()
        const idAgente = idUsuario + 1
        const resposta = respostaDoAgente(texto)
        setMensagens((lista) => [
            ...lista,
            { id: idUsuario, autor: 'usuario', texto, criadaEm: agora },
            { id: idAgente, autor: 'agente', texto: '', criadaEm: agora },
        ])
        setNovaId(idAgente)
        setRespondendo(true)

        // Simula o streaming: a resposta cresce de algumas palavras por vez.
        const palavras = resposta.split(/(\s+)/)
        let enviadas = 0
        timer.current = window.setInterval(() => {
            enviadas += 4
            setMensagens((lista) =>
                lista.map((m) => (m.id === idAgente ? { ...m, texto: palavras.slice(0, enviadas).join('') } : m)),
            )
            if (enviadas >= palavras.length) {
                window.clearInterval(timer.current)
                setRespondendo(false)
            }
        }, 60)
    }

    return (
        <div className="flex h-full flex-col">
            <div className="px-6 pt-4">
                <PageHeader
                    title="Agente de vendas"
                    description="Respostas fictícias, para mostrar o padrão de tela."
                />
            </div>
            <ChatMessageList className="min-h-0 flex-1 px-6 py-4">
                {mensagens.map((m) =>
                    m.autor === 'agente' ? (
                        <ChatBubble
                            key={m.id}
                            side="start"
                            author="Agente"
                            avatar={avatarDoAgente}
                            timestamp={m.criadaEm}
                            isNew={m.id === novaId}
                        >
                            {m.texto ? (
                                <MarkdownContent>{m.texto}</MarkdownContent>
                            ) : (
                                <span className="loading loading-dots loading-sm" />
                            )}
                        </ChatBubble>
                    ) : (
                        <ChatBubble key={m.id} side="end" timestamp={m.criadaEm}>
                            {m.texto}
                        </ChatBubble>
                    ),
                )}
            </ChatMessageList>
            <div className="border-t border-base-300 px-6 py-3">
                <ChatComposer onSend={enviar} isSending={respondendo} placeholder="Pergunte ao agente" />
            </div>
        </div>
    )
}
