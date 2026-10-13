import { fireEvent, render, screen } from '@testing-library/react'
import TextArea from '../index'

describe('TextArea', () => {
    it('deve renderizar um textarea', () => {
        render(<TextArea />)
        expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('deve renderizar com placeholder', () => {
        render(<TextArea placeholder="Digite sua mensagem" />)
        expect(screen.getByPlaceholderText('Digite sua mensagem')).toBeInTheDocument()
    })

    it('deve aplicar classe border-error quando hasError=true', () => {
        render(<TextArea hasError />)
        const textarea = screen.getByRole('textbox')
        expect(textarea.className).toContain('border-error')
    })

    it('deve aplicar classe border-light-gray quando hasError=false', () => {
        render(<TextArea />)
        const textarea = screen.getByRole('textbox')
        expect(textarea.className).toContain('border-light-gray')
    })

    it('deve aplicar className customizado', () => {
        render(<TextArea className="minha-classe" />)
        const textarea = screen.getByRole('textbox')
        expect(textarea.className).toContain('minha-classe')
    })

    it('deve aceitar valor de rows', () => {
        render(<TextArea rows={5} />)
        const textarea = screen.getByRole('textbox') as HTMLTextAreaElement
        expect(textarea.rows).toBe(5)
    })

    it('deve aceitar register props', () => {
        const register = { name: 'descricao', onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() }
        render(<TextArea register={register} />)
        const textarea = screen.getByRole('textbox')
        expect(textarea).toHaveAttribute('name', 'descricao')
    })

    it('deve permitir digitacao de texto', () => {
        render(<TextArea />)
        const textarea = screen.getByRole('textbox')
        fireEvent.change(textarea, { target: { value: 'Novo texto' } })
        expect((textarea as HTMLTextAreaElement).value).toBe('Novo texto')
    })

    it('deve estar desabilitado quando disabled=true', () => {
        render(<TextArea disabled />)
        expect(screen.getByRole('textbox')).toBeDisabled()
    })
})
