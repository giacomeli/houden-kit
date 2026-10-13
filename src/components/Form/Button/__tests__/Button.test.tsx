import { fireEvent, render, screen } from '@testing-library/react'
import Button from '../index'

describe('Button', () => {
    it('deve renderizar o children corretamente', () => {
        render(<Button>Salvar</Button>)
        expect(screen.getByText('Salvar')).toBeInTheDocument()
    })

    it('deve aplicar a classe btn por padrao', () => {
        render(<Button>Texto</Button>)
        const button = screen.getByRole('button')
        expect(button.className).toContain('btn')
    })

    it('deve aplicar btn-accent quando nenhum className e fornecido', () => {
        render(<Button>Texto</Button>)
        const button = screen.getByRole('button')
        expect(button.className).toContain('btn-accent')
    })

    it('deve aplicar className customizado no lugar de btn-accent', () => {
        render(<Button className="btn-primary">Texto</Button>)
        const button = screen.getByRole('button')
        expect(button.className).toContain('btn-primary')
        expect(button.className).not.toContain('btn-accent')
    })

    it('deve estar desabilitado quando disabled=true', () => {
        render(<Button disabled>Texto</Button>)
        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
    })

    it('deve chamar onClick ao clicar', () => {
        const handleClick = vi.fn()
        render(<Button onClick={handleClick}>Clique</Button>)
        fireEvent.click(screen.getByRole('button'))
        expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('nao deve chamar onClick quando desabilitado', () => {
        const handleClick = vi.fn()
        render(
            <Button disabled onClick={handleClick}>
                Clique
            </Button>,
        )
        fireEvent.click(screen.getByRole('button'))
        expect(handleClick).not.toHaveBeenCalled()
    })

    it('deve aplicar a classe disabled:cursor-not-allowed', () => {
        render(<Button>Texto</Button>)
        const button = screen.getByRole('button')
        expect(button.className).toContain('disabled:cursor-not-allowed')
    })

    it('deve repassar atributos HTML extras como type', () => {
        render(<Button type="submit">Enviar</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveAttribute('type', 'submit')
    })
})
