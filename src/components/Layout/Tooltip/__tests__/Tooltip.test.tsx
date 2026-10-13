import { render, screen } from '@testing-library/react'
import Tooltip from '../index'

describe('Tooltip', () => {
    it('deve renderizar os children', () => {
        render(
            <Tooltip text="Dica de ajuda">
                <button>Botao</button>
            </Tooltip>,
        )

        expect(screen.getByText('Botao')).toBeInTheDocument()
    })

    it('deve ter o atributo data-tip com o texto do tooltip', () => {
        render(
            <Tooltip text="Dica de ajuda">
                <button>Botao</button>
            </Tooltip>,
        )

        const tooltipEl = screen.getByText('Botao').parentElement
        expect(tooltipEl).toHaveAttribute('data-tip', 'Dica de ajuda')
    })

    it('deve aplicar className customizado', () => {
        render(
            <Tooltip text="Dica" className="tooltip-bottom">
                <span>Texto</span>
            </Tooltip>,
        )

        const tooltipEl = screen.getByText('Texto').parentElement
        expect(tooltipEl?.className).toContain('tooltip-bottom')
    })

    it('deve aplicar a classe tooltip base', () => {
        render(
            <Tooltip text="Dica">
                <span>Texto</span>
            </Tooltip>,
        )

        const tooltipEl = screen.getByText('Texto').parentElement
        expect(tooltipEl?.className).toContain('tooltip')
    })
})
