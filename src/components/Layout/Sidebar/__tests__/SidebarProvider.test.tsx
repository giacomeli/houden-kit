import { act, render, renderHook, screen } from '@testing-library/react'
import type { IMenuSection } from '../../../../types/menu'
import { SidebarProvider } from '../SidebarProvider'
import { useSidebarContext } from '../useSidebarContext'

/**
 * Na lib, a rota e o menu chegam por prop ao provider (no app de origem, `usePathname` e `useSidebarMenu`,
 * ambos mockados aqui). `h` deixa cada caso variar a rota e a barra escondida.
 */
const h = vi.hoisted(() => ({ pathname: '/', isHidden: false }))

const menuFalso: IMenuSection[] = [
    {
        id: 'sac',
        label: 'SAC',
        items: [{ id: 'tickets', label: 'Tickets', searchTerms: ['tickets'], href: '/tickets' }],
    },
]

// A busca da lib é o `filterMenuBySearch`; mockar mantém o teste olhando só para a camada de estado.
const filtroFalso = vi.fn()
vi.mock('../filterMenuBySearch', () => ({
    filterMenuBySearch: (menu: IMenuSection[], termo: string) => filtroFalso(menu, termo),
}))

const envolver = ({ children }: { children: React.ReactNode }) => (
    <SidebarProvider menu={menuFalso} pathname={h.pathname} isHidden={h.isHidden}>
        {children}
    </SidebarProvider>
)

describe('SidebarProvider', () => {
    beforeEach(() => {
        h.pathname = '/'
        h.isHidden = false
        filtroFalso.mockImplementation((menu: IMenuSection[]) => menu)
    })

    it('expõe o menu já filtrado, sem o consumidor tocar no hook de acesso', () => {
        const { result } = renderHook(() => useSidebarContext(), { wrapper: envolver })

        expect(result.current.filteredMenu).toEqual(menuFalso)
    })

    it('repassa o termo de busca ao filtro do menu', () => {
        const { result } = renderHook(() => useSidebarContext(), { wrapper: envolver })

        act(() => result.current.setSearchTerm('tick'))

        expect(filtroFalso).toHaveBeenCalledWith(menuFalso, 'tick')
        expect(result.current.searchTerm).toBe('tick')
    })

    /**
     * O menu de acesso é calculado com o termo fixo em vazio, para a busca não conseguir apagar
     * áreas do trilho nem desmontar o painel que hospeda o próprio campo de busca.
     */
    it('expõe também o menu sem o filtro de busca, calculado com termo vazio', () => {
        filtroFalso.mockImplementation((menu: IMenuSection[], termo: string) => (termo ? [] : menu))

        const { result } = renderHook(() => useSidebarContext(), { wrapper: envolver })
        act(() => result.current.setSearchTerm('nao-existe'))

        expect(result.current.filteredMenu).toEqual([])
        expect(result.current.menuPorAcesso).toEqual(menuFalso)
    })

    /**
     * Sem o guard, consumir o contexto fora do provider devolveria `undefined` e o erro só
     * apareceria linhas depois, como "cannot read property of undefined" dentro da variante.
     */
    it('falha com mensagem clara quando usado fora do provider', () => {
        const silenciar = vi.spyOn(console, 'error').mockImplementation(() => {})

        expect(() => renderHook(() => useSidebarContext())).toThrow(/SidebarProvider/)

        silenciar.mockRestore()
    })

    // No app de origem, as rotas que escondem a barra eram fixas no provider; na lib, o app decide.
    describe('barra escondida', () => {
        it('repassa o isHidden recebido do app', () => {
            h.isHidden = true

            const { result } = renderHook(() => useSidebarContext(), { wrapper: envolver })

            expect(result.current.isHidden).toBe(true)
        })

        it('não esconde por padrão', () => {
            const { result } = renderHook(() => useSidebarContext(), { wrapper: envolver })

            expect(result.current.isHidden).toBe(false)
        })

        it('expõe a rota recebida por prop', () => {
            h.pathname = '/vendas/conversas'

            const { result } = renderHook(() => useSidebarContext(), { wrapper: envolver })

            expect(result.current.pathname).toBe('/vendas/conversas')
        })
    })

    describe('painel contextual', () => {
        it('começa fechado', () => {
            const { result } = renderHook(() => useSidebarContext(), { wrapper: envolver })

            expect(result.current.areaAberta).toBeNull()
        })

        it('alternar abre a área e alternar a mesma área fecha', () => {
            const { result } = renderHook(() => useSidebarContext(), { wrapper: envolver })

            act(() => result.current.alternarArea('sac'))
            expect(result.current.areaAberta).toBe('sac')

            act(() => result.current.alternarArea('sac'))
            expect(result.current.areaAberta).toBeNull()
        })

        it('alternar outra área troca sem fechar', () => {
            const { result } = renderHook(() => useSidebarContext(), { wrapper: envolver })

            act(() => result.current.alternarArea('sac'))
            act(() => result.current.alternarArea('vendas'))

            expect(result.current.areaAberta).toBe('vendas')
        })

        it('fecharPainel fecha independente da área aberta', () => {
            const { result } = renderHook(() => useSidebarContext(), { wrapper: envolver })

            act(() => result.current.alternarArea('vendas'))
            act(() => result.current.fecharPainel())

            expect(result.current.areaAberta).toBeNull()
        })
    })

    it('monta os filhos normalmente', () => {
        render(
            <SidebarProvider menu={menuFalso} pathname="/">
                <span>conteúdo</span>
            </SidebarProvider>,
        )

        expect(screen.getByText('conteúdo')).toBeInTheDocument()
    })
})
