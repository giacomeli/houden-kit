import { fireEvent, render, screen } from '@testing-library/react'
import Input from '../index'

describe('Input', () => {
    it('deve renderizar sem label quando labelText nao e fornecido', () => {
        render(<Input placeholder="Digite aqui" />)
        expect(screen.getByPlaceholderText('Digite aqui')).toBeInTheDocument()
    })

    it('deve renderizar com label quando labelText e fornecido', () => {
        render(<Input labelText="Nome" />)
        expect(screen.getByText('Nome')).toBeInTheDocument()
    })

    it('deve exibir asterisco quando isRequired=true', () => {
        render(<Input labelText="Email" isRequired />)
        expect(screen.getByText(/Email/)).toBeInTheDocument()
        expect(screen.getByText(/\*/)).toBeInTheDocument()
    })

    it('deve exibir mensagem de erro quando error e fornecido', () => {
        render(<Input labelText="Nome" error="Campo obrigatorio" />)
        expect(screen.getByText('Campo obrigatorio')).toBeInTheDocument()
    })

    it('deve aplicar classe input-error quando hasError=true', () => {
        render(<Input hasError />)
        const input = screen.getByRole('textbox')
        expect(input.className).toContain('input-error')
    })

    it('deve aplicar classe input-error quando error e fornecido', () => {
        render(<Input labelText="Nome" error="Erro" />)
        const input = screen.getByRole('textbox')
        expect(input.className).toContain('input-error')
    })

    it('deve estar desabilitado quando isDisabled=true', () => {
        render(<Input isDisabled />)
        expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('deve estar desabilitado quando disabled=true', () => {
        render(<Input disabled />)
        expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('deve usar labelText como placeholder padrao quando placeholder nao e fornecido', () => {
        render(<Input labelText="Nome" />)
        expect(screen.getByPlaceholderText('Nome')).toBeInTheDocument()
    })

    it('deve usar placeholder customizado quando fornecido', () => {
        render(<Input labelText="Nome" placeholder="Digite seu nome" />)
        expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument()
    })

    it('deve exibir hint quando fornecido', () => {
        render(<Input labelText="Senha" hint="Minimo 8 caracteres" />)
        expect(screen.getByText('Minimo 8 caracteres')).toBeInTheDocument()
    })

    it('deve aplicar inputClass ao input', () => {
        render(<Input inputClass="minha-classe" />)
        const input = screen.getByRole('textbox')
        expect(input.className).toContain('minha-classe')
    })

    it('deve renderizar botao de toggle de senha quando isPassword=true', () => {
        render(<Input isPassword />)
        const toggleButton = screen.getByRole('button')
        expect(toggleButton).toBeInTheDocument()
    })

    it('deve alternar visibilidade da senha ao clicar no botao', () => {
        const { container } = render(<Input isPassword />)
        const input = container.querySelector('input') as HTMLInputElement
        // Inicialmente showPassword = true (useState(isPassword=true))
        // !showPassword ? type : 'password' -> type='password'
        expect(input.type).toBe('password')

        const toggleButton = screen.getByRole('button')
        fireEvent.click(toggleButton)
        // Apos clicar showPassword=false -> !false ? 'text' : 'password' -> type='text'
        expect(input.type).toBe('text')
    })

    it('deve aplicar register props quando fornecido', () => {
        const register = { name: 'email', onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() }
        render(<Input register={register} />)
        const input = screen.getByRole('textbox')
        expect(input).toHaveAttribute('name', 'email')
    })

    it('deve estar readOnly quando readonly=true', () => {
        render(<Input readonly />)
        const input = screen.getByRole('textbox')
        expect(input).toHaveAttribute('readonly')
    })

    it('deve aplicar maxLength ao input quando fornecido', () => {
        render(<Input maxLength={50} />)
        expect(screen.getByRole('textbox')).toHaveAttribute('maxlength', '50')
    })

    it('nao deve renderizar maxLength quando a prop nao e fornecida', () => {
        render(<Input />)
        expect(screen.getByRole('textbox')).not.toHaveAttribute('maxlength')
    })
})
