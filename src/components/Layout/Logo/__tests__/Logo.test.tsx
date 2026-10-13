import { render, screen } from '@testing-library/react'
import Logo from '../index'

describe('Logo', () => {
    it('mostra o nome completo por padrão', () => {
        const { container } = render(<Logo />)
        expect(container.textContent).toBe('Houden-kit')
    })

    it('na forma compacta, mostra o monograma com o nome como rótulo acessível', () => {
        render(<Logo compact />)
        const logo = screen.getByRole('img', { name: 'Houden-kit' })
        expect(logo).toHaveTextContent('HK')
    })

    it('aceita classes extras', () => {
        const { container } = render(<Logo className="text-xl" />)
        expect(container.firstChild).toHaveClass('text-xl')
    })
})
