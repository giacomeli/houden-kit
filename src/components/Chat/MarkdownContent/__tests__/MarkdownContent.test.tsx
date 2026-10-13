import { render, screen } from '@testing-library/react'
import MarkdownContent from '../index'

describe('MarkdownContent', () => {
    it('renderiza Markdown com GFM', () => {
        const { container } = render(
            <MarkdownContent>
                {'**Pedido** 123\n\n| Item | Qtd |\n| --- | --- |\n| Luva | 10 |\n\n- [x] faturado'}
            </MarkdownContent>,
        )
        expect(screen.getByText('Pedido').tagName).toBe('STRONG')
        expect(container.querySelector('table')).toHaveClass('table')
        expect(container.querySelector('input[type="checkbox"]')).toBeChecked()
    })

    it('abre links em nova aba, sem acesso ao opener', () => {
        render(<MarkdownContent>{'Veja [o pedido](https://exemplo.com.br/pedido/1)'}</MarkdownContent>)
        const link = screen.getByRole('link', { name: 'o pedido' })
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('não transforma HTML cru em elemento', () => {
        const { container } = render(
            <MarkdownContent>{'antes <script>alert(1)</script> <b>negrito</b>'}</MarkdownContent>,
        )
        expect(container.querySelector('script')).not.toBeInTheDocument()
        expect(container.querySelector('b')).not.toBeInTheDocument()
    })
})
