import { render, screen } from '@testing-library/react'
import ChatBubble from '../index'

describe('ChatBubble', () => {
    it('do próprio lado, usa chat-end e a cor do app de origem', () => {
        const { container } = render(<ChatBubble side="end">Olá</ChatBubble>)
        expect(container.firstChild).toHaveClass('chat', 'chat-end')
        expect(container.querySelector('.chat-bubble')).toHaveClass('bg-emerald-200')
    })

    it('do outro lado, usa chat-start e bg-base-300', () => {
        const { container } = render(<ChatBubble side="start">Olá</ChatBubble>)
        expect(container.firstChild).toHaveClass('chat-start')
        expect(container.querySelector('.chat-bubble')).toHaveClass('bg-base-300')
    })

    it('mostra autor, avatar, rodapé e hora', () => {
        const { container } = render(
            <ChatBubble
                side="start"
                author="Agente"
                avatar={<span>A</span>}
                footer={<span>lida</span>}
                timestamp="2026-10-13T14:30:00Z"
            >
                Resposta
            </ChatBubble>,
        )
        expect(screen.getByText('Agente')).toBeInTheDocument()
        expect(container.querySelector('.chat-image')).toHaveTextContent('A')
        expect(screen.getByText('lida')).toBeInTheDocument()
        expect(container.querySelector('time')).toHaveTextContent('14:30')
    })

    it('anima a mensagem nova', () => {
        const { container } = render(
            <ChatBubble side="end" isNew>
                Olá
            </ChatBubble>,
        )
        expect(container.firstChild).toHaveClass('message-new')
    })
})
