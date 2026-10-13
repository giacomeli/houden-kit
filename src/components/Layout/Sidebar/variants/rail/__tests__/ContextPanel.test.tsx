import { fireEvent, render, screen } from '@testing-library/react'
import { LifeBuoy } from 'lucide-react'
import type { IMenuItem, IMenuSection } from '../../../../../../types/menu'
import ContextPanel from '../ContextPanel'

const h = vi.hoisted(() => ({
    contexto: {} as Record<string, unknown>,
    ativo: { itemAtivoId: null as string | null, areaAtivaId: null as string | null },
}))

vi.mock('../../../useSidebarContext', () => ({ useSidebarContext: () => h.contexto }))
vi.mock('../../../useActiveMenuItem', () => ({ useActiveMenuItem: () => h.ativo }))

const item = (id: string, label: string, href?: string, children?: IMenuItem[]): IMenuItem => ({
    id,
    label,
    searchTerms: [label],
    href,
    children,
})

const areas: IMenuSection[] = [
    {
        id: 'sac',
        label: 'SAC',
        icon: LifeBuoy,
        items: [
            item('tickets', 'Tickets', undefined, [item('abertos', 'Abertos', '/tickets/abertos')]),
            item('atendimento', 'Atendimento Clientes', '/sac/externo'),
        ],
    },
    {
        id: 'vendas',
        label: 'Vendas',
        icon: LifeBuoy,
        items: [item('pedidos', 'Pedidos', '/vendas/pedidos')],
    },
]

const setSearchTerm = vi.fn()
const fecharPainel = vi.fn()

const montar = (areaAberta: string | null = 'sac', searchTerm = '') => {
    h.contexto = {
        filteredMenu: areas,
        menuPorAcesso: areas,
        areaAberta,
        searchTerm,
        setSearchTerm,
        fecharPainel,
    }
    return render(<ContextPanel />)
}

/** Busca que não casa com nada: o menu filtrado fica vazio, o de acesso permanece. */
const montarSemResultado = (areaAberta: string | null = 'sac') => {
    h.contexto = {
        filteredMenu: [],
        menuPorAcesso: areas,
        areaAberta,
        searchTerm: 'xyzabc',
        setSearchTerm,
        fecharPainel,
    }
    return render(<ContextPanel />)
}

describe('ContextPanel', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        h.ativo = { itemAtivoId: null, areaAtivaId: null }
    })

    it('não monta nada quando nenhuma área está aberta', () => {
        const { container } = montar(null)

        expect(container).toBeEmptyDOMElement()
    })

    it('monta apenas os itens da área aberta', () => {
        montar('sac')

        expect(screen.getByText('Tickets')).toBeInTheDocument()
        expect(screen.getByText('Atendimento Clientes')).toBeInTheDocument()
        expect(screen.queryByText('Pedidos')).not.toBeInTheDocument()
    })

    it('mostra o nome da área no cabeçalho', () => {
        montar('sac')

        expect(screen.getByRole('heading', { name: 'SAC' })).toBeInTheDocument()
    })

    it('a busca escreve no estado compartilhado, que é quem filtra', () => {
        montar('sac')

        fireEvent.change(screen.getByPlaceholderText('Buscar menu...'), { target: { value: 'tick' } })

        expect(setSearchTerm).toHaveBeenCalledWith('tick')
    })

    it('marca o item da rota atual com aria-current', () => {
        h.ativo = { itemAtivoId: 'atendimento', areaAtivaId: 'sac' }
        montar('sac')

        expect(screen.getByRole('link', { name: 'Atendimento Clientes' })).toHaveAttribute('aria-current', 'page')
    })

    /**
     * O painel é transitório: abre no clique e fecha ao navegar. Acordeão recolhido aqui cobraria um
     * clique só para revelar o destino, que é o oposto da razão de o painel existir. Tudo expandido
     * troca cliques por rolagem, e rolar é mais barato do que caçar.
     */
    it('abre com todos os submenus expandidos', () => {
        montar('sac')

        expect(screen.getByRole('link', { name: 'Abertos' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Tickets/ })).toHaveAttribute('aria-expanded', 'true')
    })

    it('clicar no pai recolhe, para quem quiser encurtar a lista', () => {
        montar('sac')

        // `fireEvent` em vez de `.click()` do DOM: a expansão muda estado, e o clique cru não passa
        // pelo `act` do React, então a re-renderização não acontece antes da asserção.
        fireEvent.click(screen.getByRole('button', { name: /Tickets/ }))

        expect(screen.queryByRole('link', { name: 'Abertos' })).not.toBeInTheDocument()
    })

    it('reabrir a área devolve tudo expandido, sem lembrar o que foi recolhido', () => {
        const { unmount } = montar('sac')
        fireEvent.click(screen.getByRole('button', { name: /Tickets/ }))
        unmount()

        montar('sac')

        expect(screen.getByRole('link', { name: 'Abertos' })).toBeInTheDocument()
    })

    /**
     * O campo de busca vive dentro do painel. Quando o painel procurava a área aberta no menu já
     * filtrado pela busca, digitar algo sem correspondência esvaziava a lista, a área não era
     * encontrada e o painel desmontava — levando junto o próprio campo que causou aquilo. O
     * `searchTerm` continuava preenchido no contexto e não havia mais como editá-lo: só recarregando
     * a página. O controle que define o estado não pode ser destruído pelo estado que ele define.
     */
    describe('busca sem resultado', () => {
        it('mantém o painel montado', () => {
            montarSemResultado()

            expect(screen.getByRole('heading', { name: 'SAC' })).toBeInTheDocument()
        })

        it('mantém o campo de busca utilizável, com o termo digitado', () => {
            montarSemResultado()

            const campo = screen.getByPlaceholderText('Buscar menu...')
            expect(campo).toHaveValue('xyzabc')

            fireEvent.change(campo, { target: { value: '' } })
            expect(setSearchTerm).toHaveBeenCalledWith('')
        })

        it('avisa que nada foi encontrado em vez de mostrar uma lista vazia e muda', () => {
            montarSemResultado()

            expect(screen.getByText(/nenhum item/i)).toBeInTheDocument()
        })

        it('oferece limpar a busca em um clique', () => {
            montarSemResultado()

            fireEvent.click(screen.getByRole('button', { name: /limpar busca/i }))

            expect(setSearchTerm).toHaveBeenCalledWith('')
        })
    })

    it('navegar por um item fecha o painel', () => {
        montar('sac')

        screen.getByRole('link', { name: 'Atendimento Clientes' }).click()

        expect(fecharPainel).toHaveBeenCalled()
    })

    it('o botão de fechar fecha o painel', () => {
        montar('sac')

        screen.getByRole('button', { name: 'Fechar painel' }).click()

        expect(fecharPainel).toHaveBeenCalled()
    })
})
