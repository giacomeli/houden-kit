import { renderHook } from '@testing-library/react'
import type { IMenuItem, IMenuSection } from '../../../../types/menu'
import { useActiveMenuItem } from '../useActiveMenuItem'

/**
 * Na lib, a rota chega pelo contexto da Sidebar (no app de origem, `usePathname`). O mock do contexto
 * deixa cada caso variar a rota.
 */
const h = vi.hoisted(() => ({ pathname: '/' }))

vi.mock('../useSidebarContext', () => ({
    useSidebarContext: () => ({ pathname: h.pathname }),
}))

const item = (id: string, href?: string, children?: IMenuItem[]): IMenuItem => ({
    id,
    label: id,
    searchTerms: [id],
    href,
    children,
})

const menu: IMenuSection[] = [
    {
        id: 'main',
        items: [
            item('dashboard', '/dashboard'),
            item('cadastros', undefined, [item('usuarios', '/cadastros/usuarios')]),
            item('links', undefined, [item('externo', 'https://exemplo.com.br/painel')]),
        ],
    },
    {
        id: 'vendas',
        label: 'Vendas',
        items: [item('pedidos', '/vendas/pedidos'), item('pedidos-inserir', '/vendas/pedidos/inserir')],
    },
]

const ativo = () => renderHook(() => useActiveMenuItem(menu)).result.current

describe('useActiveMenuItem', () => {
    beforeEach(() => {
        h.pathname = '/'
    })

    it('casa a rota exata com o item', () => {
        h.pathname = '/dashboard'

        expect(ativo()).toEqual({ itemAtivoId: 'dashboard', areaAtivaId: 'main' })
    })

    /**
     * O detalhe de um pedido é `/vendas/pedidos/123`, rota que não existe no menu. Sem casar a rota
     * filha com o item pai, o menu ficaria sem nada marcado justamente nas telas de detalhe, que é
     * onde a pessoa mais precisa saber onde está.
     */
    it('casa a rota filha com o item pai', () => {
        h.pathname = '/vendas/pedidos/12345'

        expect(ativo().itemAtivoId).toBe('pedidos')
    })

    it('escolhe o item mais específico quando dois casam', () => {
        h.pathname = '/vendas/pedidos/inserir'

        expect(ativo().itemAtivoId).toBe('pedidos-inserir')
    })

    it('encontra item dentro de submenu e reporta a área que o contém', () => {
        h.pathname = '/cadastros/usuarios'

        expect(ativo()).toEqual({ itemAtivoId: 'usuarios', areaAtivaId: 'main' })
    })

    it('não marca nada quando a rota não corresponde a item nenhum', () => {
        h.pathname = '/rota/que/nao/existe'

        expect(ativo()).toEqual({ itemAtivoId: null, areaAtivaId: null })
    })

    /**
     * Prefixo puro casaria qualquer coisa: `/vendas/pedidos-antigos` começa com `/vendas/pedidos`
     * sem ser uma rota filha dele. A comparação precisa respeitar a fronteira de segmento.
     */
    it('não casa rota que só compartilha prefixo textual', () => {
        h.pathname = '/vendas/pedidos-antigos'

        expect(ativo().itemAtivoId).toBeNull()
    })

    it('ignora link externo, que nunca é a rota atual', () => {
        h.pathname = '/painel'

        expect(ativo().itemAtivoId).toBeNull()
    })
})
