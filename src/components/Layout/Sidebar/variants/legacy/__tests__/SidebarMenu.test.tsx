import { render, screen } from '@testing-library/react'
import type { IMenuItem } from '../../../../../../types/menu'
import SidebarMenu from '../SidebarMenu'

/**
 * O ícone do menu passou a ser o próprio componente do `lucide-react`, recebido pela configuração.
 * Aqui entra um substituto que expõe `size` e `strokeWidth` como atributos, porque o tamanho é
 * justamente o que os testes de layout colapsado verificam — antes era classe, agora é prop.
 */
const IconeFalso = ({ size, strokeWidth, className }: any) => (
    <span data-testid="icone" data-size={size} data-traco={strokeWidth} className={className} />
)

const criarItem = (overrides: Partial<IMenuItem> = {}): IMenuItem => ({
    id: 'item-1',
    label: 'Item de Teste',
    searchTerms: ['teste'],
    href: '/teste',
    ...overrides,
})

describe('SidebarMenu', () => {
    it('deve renderizar itens de menu com link', () => {
        const items: IMenuItem[] = [
            criarItem({ id: 'vendas', label: 'Vendas', href: '/vendas' }),
            criarItem({ id: 'tickets', label: 'Tickets', href: '/tickets' }),
        ]

        render(<SidebarMenu items={items} isSidebarFullWidth={true} isSearching={false} />)

        expect(screen.getByText('Vendas')).toBeInTheDocument()
        expect(screen.getByText('Tickets')).toBeInTheDocument()
    })

    it('deve renderizar links com href correto', () => {
        const items: IMenuItem[] = [criarItem({ id: 'vendas', label: 'Vendas', href: '/vendas' })]

        render(<SidebarMenu items={items} isSidebarFullWidth={true} isSearching={false} />)

        const link = screen.getByText('Vendas').closest('a')
        expect(link).toHaveAttribute('href', '/vendas')
    })

    it('deve renderizar itens com submenu quando sidebar expandida', () => {
        const items: IMenuItem[] = [
            criarItem({
                id: 'parent',
                label: 'Menu Pai',
                href: undefined,
                children: [
                    criarItem({ id: 'child-1', label: 'Submenu 1', href: '/sub1' }),
                    criarItem({ id: 'child-2', label: 'Submenu 2', href: '/sub2' }),
                ],
            }),
        ]

        render(<SidebarMenu items={items} isSidebarFullWidth={true} isSearching={false} />)

        expect(screen.getByText('Menu Pai')).toBeInTheDocument()
        expect(screen.getByText('Submenu 1')).toBeInTheDocument()
        expect(screen.getByText('Submenu 2')).toBeInTheDocument()
    })

    it('nao deve renderizar labels quando sidebar colapsada com submenu', () => {
        const items: IMenuItem[] = [
            criarItem({
                id: 'parent',
                label: 'Menu Pai',
                href: undefined,
                children: [criarItem({ id: 'child-1', label: 'Submenu 1', href: '/sub1' })],
            }),
        ]

        render(<SidebarMenu items={items} isSidebarFullWidth={false} isSearching={false} />)

        expect(screen.queryByText('Submenu 1')).not.toBeInTheDocument()
    })

    /**
     * Com a barra colapsada em 70 px, o ícone ficava 10 px à esquerda do centro. Não era desalinho
     * de CSS: o `menu` do DaisyUI monta o item como grid de duas colunas com `gap: 8px`, e o rótulo
     * colapsado vai a largura zero mas a coluna e o gap continuam existindo, deslocando o ícone.
     * Daí a centralização exigir zerar gap e padding, não só `justify-center`.
     */
    describe('barra colapsada', () => {
        const comIcone = (overrides: Partial<IMenuItem> = {}) => criarItem({ icon: IconeFalso as any, ...overrides })

        it('centraliza o item de link, sem gap nem padding lateral', () => {
            render(<SidebarMenu items={[comIcone()]} isSidebarFullWidth={false} isSearching={false} />)

            const link = screen.getByRole('link')
            expect(link).toHaveClass('justify-center')
            expect(link).toHaveClass('gap-0')
            expect(link).toHaveClass('px-0')
        })

        it('não centraliza quando expandida: o rótulo ocupa a segunda coluna', () => {
            render(<SidebarMenu items={[comIcone()]} isSidebarFullWidth={true} isSearching={false} />)

            expect(screen.getByRole('link')).not.toHaveClass('justify-center')
        })

        it('aumenta o ícone do link, que herdava os 12 px do texto', () => {
            const { unmount } = render(
                <SidebarMenu items={[comIcone()]} isSidebarFullWidth={false} isSearching={false} />,
            )
            expect(screen.getByTestId('icone')).toHaveAttribute('data-size', '20')

            unmount()
            render(<SidebarMenu items={[comIcone()]} isSidebarFullWidth={true} isSearching={false} />)
            expect(screen.getByTestId('icone')).toHaveAttribute('data-size', '16')
        })

        it('aplica o mesmo tratamento ao item com submenu, que é um summary e não um link', () => {
            const pai = comIcone({
                id: 'pai',
                href: undefined,
                children: [criarItem({ id: 'filho', label: 'Filho', href: '/filho' })],
            })

            const { container } = render(<SidebarMenu items={[pai]} isSidebarFullWidth={false} isSearching={false} />)

            const summary = container.querySelector('summary')
            expect(summary).toHaveClass('justify-center')
            expect(summary).toHaveClass('gap-0')
            expect(screen.getByTestId('icone')).toHaveAttribute('data-size', '20')
        })
    })

    it('nao deve renderizar item sem href e sem children', () => {
        const items: IMenuItem[] = [
            criarItem({ id: 'vazio', label: 'Item Vazio', href: undefined, children: undefined }),
        ]

        render(<SidebarMenu items={items} isSidebarFullWidth={true} isSearching={false} />)

        expect(screen.queryByText('Item Vazio')).not.toBeInTheDocument()
    })
})
