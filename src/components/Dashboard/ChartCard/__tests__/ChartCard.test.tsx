import { fireEvent, render, screen } from '@testing-library/react'
import ChartCard from '../index'

describe('ChartCard', () => {
    it('deve renderizar o titulo', () => {
        render(
            <ChartCard title="Vendas por Mes">
                <div>Grafico</div>
            </ChartCard>,
        )

        expect(screen.getByText('Vendas por Mes')).toBeInTheDocument()
    })

    it('deve renderizar o conteudo children', () => {
        render(
            <ChartCard title="Vendas">
                <div>Conteudo do grafico</div>
            </ChartCard>,
        )

        expect(screen.getByText('Conteudo do grafico')).toBeInTheDocument()
    })

    it('deve expandir ao clicar no botao de toggle', () => {
        const { container } = render(
            <ChartCard title="Vendas">
                <div>Grafico</div>
            </ChartCard>,
        )

        // O alternador é o ícone lucide (no app de origem, FontAwesomeIcon mockado com data-testid)
        const toggleBtn = container.querySelector('svg.lucide') as Element
        const card = container.firstChild as HTMLElement

        // Inicialmente nao deve ter col-span-2
        expect(card.className).not.toContain('col-span-2')

        // Clicar para expandir
        fireEvent.click(toggleBtn)

        // Apos clique, deve ter col-span-2
        expect(card.className).toContain('col-span-2')
    })

    it('deve colapsar ao clicar novamente', () => {
        const { container } = render(
            <ChartCard title="Vendas">
                <div>Grafico</div>
            </ChartCard>,
        )

        // O alternador é o ícone lucide (no app de origem, FontAwesomeIcon mockado com data-testid)
        const toggleBtn = container.querySelector('svg.lucide') as Element
        const card = container.firstChild as HTMLElement

        // Expandir
        fireEvent.click(toggleBtn)
        expect(card.className).toContain('col-span-2')

        // Colapsar. Plus e Minus são componentes lucide diferentes, então o React troca o nó do ícone;
        // no app de origem, o FontAwesomeIcon mockado mantinha o mesmo nó.
        fireEvent.click(container.querySelector('svg.lucide') as Element)
        expect(card.className).not.toContain('col-span-2')
    })

    it('deve aplicar className customizado', () => {
        const { container } = render(
            <ChartCard title="Vendas" className="minha-classe">
                <div>Grafico</div>
            </ChartCard>,
        )

        expect(container.firstChild).toHaveClass('minha-classe')
    })
})
