import { render, screen } from '@testing-library/react'
import DashboardCard from '../index'

// Mock do Tooltip
vi.mock('../../../Layout/Tooltip', () => ({
    default: ({ text, children }: { text: string; children: React.ReactNode }) => (
        <div data-testid="tooltip" data-tip={text}>
            {children}
        </div>
    ),
}))

describe('DashboardCard', () => {
    const defaultProps = {
        icon: <span data-testid="card-icon">icone</span>,
        title: 'Total de Vendas',
        description: 'Soma de todas as vendas do periodo',
        value: 'R$ 15.000,00',
    }

    it('deve renderizar o icone', () => {
        render(<DashboardCard {...defaultProps} />)

        expect(screen.getByTestId('card-icon')).toBeInTheDocument()
    })

    it('deve renderizar o titulo', () => {
        render(<DashboardCard {...defaultProps} />)

        expect(screen.getByText('Total de Vendas')).toBeInTheDocument()
    })

    it('deve renderizar o valor', () => {
        render(<DashboardCard {...defaultProps} />)

        expect(screen.getByText('R$ 15.000,00')).toBeInTheDocument()
    })

    it('deve renderizar o tooltip com a descricao', () => {
        render(<DashboardCard {...defaultProps} />)

        const tooltip = screen.getByTestId('tooltip')
        expect(tooltip).toHaveAttribute('data-tip', 'Soma de todas as vendas do periodo')
    })

    it('deve aplicar className customizado', () => {
        const { container } = render(<DashboardCard {...defaultProps} className="custom-class" />)

        expect(container.firstChild).toHaveClass('custom-class')
    })
})
