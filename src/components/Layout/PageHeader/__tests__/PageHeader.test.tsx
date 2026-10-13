import { render, screen } from '@testing-library/react'
import PageHeader from '../index'

describe('PageHeader', () => {
    it('renderiza o título como cabeçalho da tela', () => {
        render(<PageHeader title="Clientes" />)
        expect(screen.getByRole('heading', { level: 1, name: 'Clientes' })).toHaveClass('text-xl')
    })

    it('mostra descrição e ações quando informadas', () => {
        render(
            <PageHeader
                title="Clientes"
                description="Carteira ativa"
                actions={
                    <button type="button" className="btn">
                        Novo
                    </button>
                }
            />,
        )
        expect(screen.getByText('Carteira ativa')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Novo' })).toBeInTheDocument()
    })

    it('não deixa contêiner vazio sem ações', () => {
        const { container } = render(<PageHeader title="Clientes" />)
        expect(container.querySelector('.shrink-0')).not.toBeInTheDocument()
    })
})
