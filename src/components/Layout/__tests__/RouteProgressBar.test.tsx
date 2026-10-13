import { render } from '@testing-library/react'
import RouteProgressBar from '../RouteProgressBar'

describe('RouteProgressBar', () => {
    it('nao deve estar visivel inicialmente', () => {
        const { container } = render(<RouteProgressBar pathname="/" />)

        // Componente renderiza com display:none quando nao esta navegando
        const bar = container.firstElementChild as HTMLElement
        expect(bar).toBeTruthy()
        expect(bar.style.display).toBe('none')
    })

    it('deve ficar visivel ao clicar em um link interno', async () => {
        const { container } = render(<RouteProgressBar pathname="/" />)

        const link = document.createElement('a')
        link.href = '/outra-pagina'
        link.setAttribute('href', '/outra-pagina')
        link.textContent = 'Navegar'
        document.body.appendChild(link)

        link.click()

        const bar = container.firstElementChild as HTMLElement
        expect(bar.style.display).toBe('block')

        document.body.removeChild(link)
    })

    it('nao deve reagir a links externos', () => {
        const { container } = render(<RouteProgressBar pathname="/" />)

        const link = document.createElement('a')
        link.href = 'https://google.com'
        link.setAttribute('href', 'https://google.com')
        link.textContent = 'Google'
        document.body.appendChild(link)

        link.click()

        const bar = container.firstElementChild as HTMLElement
        expect(bar.style.display).toBe('none')

        document.body.removeChild(link)
    })

    it('nao deve reagir a links com target="_blank"', () => {
        const { container } = render(<RouteProgressBar pathname="/" />)

        const link = document.createElement('a')
        link.href = '/nova-pagina'
        link.setAttribute('href', '/nova-pagina')
        link.target = '_blank'
        link.textContent = 'Nova aba'
        document.body.appendChild(link)

        link.click()

        const bar = container.firstElementChild as HTMLElement
        expect(bar.style.display).toBe('none')

        document.body.removeChild(link)
    })

    it('deve reagir ao evento navigation:start', () => {
        const { container } = render(<RouteProgressBar pathname="/" />)

        window.dispatchEvent(new CustomEvent('navigation:start', { detail: { href: '/tickets/1' } }))

        const bar = container.firstElementChild as HTMLElement
        expect(bar.style.display).toBe('block')
    })
})
