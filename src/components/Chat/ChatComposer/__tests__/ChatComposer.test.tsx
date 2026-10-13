import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatComposer from '../index'

describe('ChatComposer', () => {
    it('Enter envia o texto sem espaços nas pontas e limpa o campo', async () => {
        const onSend = vi.fn()
        render(<ChatComposer onSend={onSend} />)
        const campo = screen.getByRole('textbox', { name: 'Digite uma mensagem' })
        await userEvent.type(campo, '  Qual o status do pedido?{Enter}')
        expect(onSend).toHaveBeenCalledWith('Qual o status do pedido?')
        expect(campo).toHaveValue('')
    })

    it('Shift+Enter quebra linha e não envia', async () => {
        const onSend = vi.fn()
        render(<ChatComposer onSend={onSend} />)
        const campo = screen.getByRole('textbox')
        await userEvent.type(campo, 'linha 1{Shift>}{Enter}{/Shift}linha 2')
        expect(onSend).not.toHaveBeenCalled()
        expect(campo).toHaveValue('linha 1\nlinha 2')
    })

    it('Enter durante a composição de IME não envia', () => {
        const onSend = vi.fn()
        render(<ChatComposer onSend={onSend} />)
        const campo = screen.getByRole('textbox')
        fireEvent.change(campo, { target: { value: 'cafe' } })
        fireEvent.keyDown(campo, { key: 'Enter', isComposing: true })
        expect(onSend).not.toHaveBeenCalled()
    })

    it('não envia vazio nem só com espaços', async () => {
        const onSend = vi.fn()
        render(<ChatComposer onSend={onSend} />)
        await userEvent.type(screen.getByRole('textbox'), '   {Enter}')
        expect(onSend).not.toHaveBeenCalled()
        expect(screen.getByRole('button', { name: 'Enviar mensagem' })).toBeDisabled()
    })

    it('enviando, bloqueia o botão e mostra carregamento', async () => {
        const onSend = vi.fn()
        render(<ChatComposer onSend={onSend} isSending />)
        await userEvent.type(screen.getByRole('textbox'), 'oi{Enter}')
        expect(onSend).not.toHaveBeenCalled()
        const botao = screen.getByRole('button', { name: 'Enviar mensagem' })
        expect(botao).toBeDisabled()
        expect(botao.querySelector('.loading')).toBeInTheDocument()
    })

    it('o botão envia', async () => {
        const onSend = vi.fn()
        render(<ChatComposer onSend={onSend} placeholder="Pergunte ao agente" />)
        await userEvent.type(screen.getByRole('textbox', { name: 'Pergunte ao agente' }), 'oi')
        await userEvent.click(screen.getByRole('button', { name: 'Enviar mensagem' }))
        expect(onSend).toHaveBeenCalledWith('oi')
    })
})
