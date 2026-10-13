import { fireEvent, render, screen } from '@testing-library/react'
import ChatMessageList from '../index'

// O jsdom não calcula layout; as medidas da lista são definidas à mão.
function medir(el: HTMLElement, { scrollHeight, clientHeight }: { scrollHeight: number; clientHeight: number }) {
    Object.defineProperty(el, 'scrollHeight', { configurable: true, value: scrollHeight })
    Object.defineProperty(el, 'clientHeight', { configurable: true, value: clientHeight })
}

describe('ChatMessageList', () => {
    it('é uma região de log anunciada para leitores de tela', () => {
        render(<ChatMessageList>mensagens</ChatMessageList>)
        const log = screen.getByRole('log', { name: 'Mensagens' })
        expect(log).toHaveAttribute('aria-live', 'polite')
    })

    it('acompanha o fim quando chega mensagem nova', () => {
        const { rerender } = render(<ChatMessageList>{['a']}</ChatMessageList>)
        const log = screen.getByRole('log')
        medir(log, { scrollHeight: 1000, clientHeight: 300 })
        rerender(<ChatMessageList>{['a', 'b']}</ChatMessageList>)
        expect(log.scrollTop).toBe(1000)
    })

    it('não puxa de volta quem rolou para ler o histórico', () => {
        const { rerender } = render(<ChatMessageList>{['a']}</ChatMessageList>)
        const log = screen.getByRole('log')
        medir(log, { scrollHeight: 1000, clientHeight: 300 })
        log.scrollTop = 100
        fireEvent.scroll(log)
        rerender(<ChatMessageList>{['a', 'b']}</ChatMessageList>)
        expect(log.scrollTop).toBe(100)
    })
})
