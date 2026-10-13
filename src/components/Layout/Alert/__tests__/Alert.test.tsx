import { render, screen } from '@testing-library/react'
import Alert from '../index'

describe('Alert', () => {
    it('deve renderizar a mensagem de texto', () => {
        render(
            <Alert
                message="Operacao realizada com sucesso"
                icon={<span data-testid="icone">icon</span>}
                className="alert-success"
            />,
        )

        expect(screen.getByText('Operacao realizada com sucesso')).toBeInTheDocument()
    })

    it('deve renderizar o icone fornecido', () => {
        render(<Alert message="Mensagem" icon={<span data-testid="icone">icon</span>} className="alert-success" />)

        expect(screen.getByTestId('icone')).toBeInTheDocument()
    })

    it('deve aplicar a classe de variante correta', () => {
        render(<Alert message="Erro encontrado" icon={<span>!</span>} className="alert-error" />)

        const alert = screen.getByRole('alert')
        expect(alert.className).toContain('alert-error')
    })

    it('deve ter role="alert" para acessibilidade', () => {
        render(<Alert message="Aviso" icon={<span>i</span>} className="alert-warning" />)

        expect(screen.getByRole('alert')).toBeInTheDocument()
    })
})
