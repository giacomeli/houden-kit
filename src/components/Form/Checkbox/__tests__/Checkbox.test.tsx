import { fireEvent, render, screen } from '@testing-library/react'
import Checkbox from '../index'

describe('Checkbox', () => {
    it('deve renderizar um checkbox', () => {
        render(<Checkbox />)
        expect(screen.getByRole('checkbox')).toBeInTheDocument()
    })

    it('deve aplicar a classe checkbox por padrao', () => {
        render(<Checkbox />)
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox.className).toContain('checkbox')
    })

    it('deve aplicar classes toggle quando toggle=true', () => {
        render(<Checkbox toggle />)
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox.className).toContain('toggle')
        expect(checkbox.className).toContain('toggle-accent')
    })

    it('nao deve aplicar classe checkbox quando toggle=true', () => {
        render(<Checkbox toggle />)
        const checkbox = screen.getByRole('checkbox')
        // A classe toggle substitui checkbox
        expect(checkbox.className).toContain('toggle')
    })

    it('deve aplicar className customizado', () => {
        render(<Checkbox className="minha-classe" />)
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox.className).toContain('minha-classe')
    })

    it('deve alternar estado checked ao clicar', () => {
        render(<Checkbox />)
        const checkbox = screen.getByRole('checkbox') as HTMLInputElement
        expect(checkbox.checked).toBe(false)
        fireEvent.click(checkbox)
        expect(checkbox.checked).toBe(true)
    })

    it('deve estar desabilitado quando disabled=true', () => {
        render(<Checkbox disabled />)
        expect(screen.getByRole('checkbox')).toBeDisabled()
    })

    it('deve aceitar register props', () => {
        const register = { name: 'aceito', onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() }
        render(<Checkbox register={register} />)
        const checkbox = screen.getByRole('checkbox')
        expect(checkbox).toHaveAttribute('name', 'aceito')
    })

    it('deve renderizar com checked inicial', () => {
        render(<Checkbox defaultChecked />)
        const checkbox = screen.getByRole('checkbox') as HTMLInputElement
        expect(checkbox.checked).toBe(true)
    })
})
