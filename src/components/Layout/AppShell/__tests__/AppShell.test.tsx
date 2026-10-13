import { render, screen } from '@testing-library/react'
import AppShell from '../index'

describe('AppShell', () => {
    it('renderiza a navegação lateral e o conteúdo', () => {
        render(
            <AppShell pathname="/" sidebar={<nav aria-label="Menu" />}>
                <p>Conteúdo</p>
            </AppShell>,
        )
        expect(screen.getByRole('navigation', { name: 'Menu' })).toBeInTheDocument()
        expect(screen.getByText('Conteúdo')).toBeInTheDocument()
    })

    it('reproduz a estrutura do layout autenticado do app de origem', () => {
        const { container } = render(<AppShell pathname="/">conteúdo</AppShell>)
        const raiz = container.firstChild as HTMLElement
        expect(raiz).toHaveClass('relative', 'flex', 'flex-row')
        expect(raiz.querySelector('.w-full.min-w-0.bg-base-100')).toBeInTheDocument()
        // RouteProgressBar: barra fixa no topo, escondida até haver navegação
        expect(raiz.querySelector('.fixed.top-0.h-1')).toBeInTheDocument()
    })

    it('em tela de altura fixa, não deixa a página rolar', () => {
        const { container } = render(
            <AppShell pathname="/chat" fullHeight>
                conteúdo
            </AppShell>,
        )
        expect(container.querySelector('.h-screen.overflow-hidden')).toBeInTheDocument()
        expect(container.querySelector('.p-0')).not.toBeInTheDocument()
    })
})
