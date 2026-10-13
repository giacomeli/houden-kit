import type { IMenuItem, IMenuSection } from '../../../../types/menu'
import { filterMenuBySearch } from '../filterMenuBySearch'

// O app de origem não tem teste da busca isolada (o do `useSidebarMenu` cobre memoização e acesso por
// módulo, que ficaram fora da lib). Estes casos cobrem a busca extraída dele.

const item = (id: string, searchTerms: string[], children?: IMenuItem[]): IMenuItem => ({
    id,
    label: id,
    searchTerms,
    href: children ? undefined : `/${id}`,
    children,
})

const menu: IMenuSection[] = [
    {
        id: 'vendas',
        label: 'Vendas',
        items: [
            item('pedidos', ['pedidos', 'vendas']),
            item('cadastros', ['cadastros'], [item('clientes', ['clientes']), item('produtos', ['produtos'])]),
        ],
    },
    { id: 'sac', label: 'SAC', items: [item('tickets', ['Atendimento ao cliente'])] },
    { id: 'vazia', label: 'Vazia', items: [] },
]

describe('filterMenuBySearch', () => {
    it('sem termo, devolve todas as seções com itens', () => {
        expect(filterMenuBySearch(menu, '').map((s) => s.id)).toEqual(['vendas', 'sac'])
    })

    it('remove a seção que fica sem itens, inclusive com termo vazio', () => {
        expect(filterMenuBySearch(menu, '').some((s) => s.id === 'vazia')).toBe(false)
    })

    it('ignora acentos, caixa e espaços', () => {
        const resultado = filterMenuBySearch(menu, 'ATENDIMENTOAO')
        expect(resultado.map((s) => s.id)).toEqual(['sac'])
        expect(filterMenuBySearch(menu, 'Pédidos')[0].items.map((i) => i.id)).toEqual(['pedidos'])
    })

    it('mantém o pai quando um filho casa, só com os filhos que casam', () => {
        const [vendas] = filterMenuBySearch(menu, 'clien')
        expect(vendas.items.map((i) => i.id)).toEqual(['cadastros'])
        expect(vendas.items[0].children?.map((c) => c.id)).toEqual(['clientes'])
    })

    it('mantém o pai quando ele mesmo casa, mesmo sem filhos que casem', () => {
        const [vendas] = filterMenuBySearch(menu, 'cadastros')
        expect(vendas.items.map((i) => i.id)).toEqual(['cadastros'])
        expect(vendas.items[0].children).toEqual([])
    })

    it('sem correspondência, devolve lista vazia', () => {
        expect(filterMenuBySearch(menu, 'nao-existe')).toEqual([])
    })

    it('não altera o menu recebido', () => {
        const copia = structuredClone(menu)
        filterMenuBySearch(menu, 'clien')
        expect(menu).toEqual(copia)
    })
})
