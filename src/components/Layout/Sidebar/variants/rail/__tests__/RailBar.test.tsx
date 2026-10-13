import { render, screen } from '@testing-library/react'
import { LayoutGrid, LifeBuoy } from 'lucide-react'
import type { IMenuSection } from '../../../../../../types/menu'
import RailBar from '../RailBar'

const h = vi.hoisted(() => ({
    contexto: {} as Record<string, unknown>,
    ativo: { itemAtivoId: null as string | null, areaAtivaId: null as string | null },
}))

vi.mock('../../../useSidebarContext', () => ({ useSidebarContext: () => h.contexto }))
vi.mock('../../../useActiveMenuItem', () => ({ useActiveMenuItem: () => h.ativo }))

const areas: IMenuSection[] = [
    { id: 'main', label: 'Geral', icon: LayoutGrid, items: [] },
    { id: 'sac', label: 'SAC', icon: LifeBuoy, items: [] },
]

const alternarArea = vi.fn()

const montar = (areaAberta: string | null = null) => {
    // Na lib, o perfil chega pelo slot `userProfile` do contexto (no app de origem, SidebarUserProfile mockado).
    h.contexto = {
        filteredMenu: areas,
        menuPorAcesso: areas,
        areaAberta,
        alternarArea,
        userProfile: () => <div data-testid="perfil" />,
    }
    return render(<RailBar />)
}

describe('RailBar', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        h.ativo = { itemAtivoId: null, areaAtivaId: null }
    })

    it('mostra uma entrada por área do menu já filtrado', () => {
        montar()

        expect(screen.getByRole('button', { name: 'Geral' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'SAC' })).toBeInTheDocument()
    })

    /**
     * Com o painel fechado o rótulo não aparece em lugar nenhum, então sem tooltip a navegação vira
     * adivinhação. É requisito, não enfeite.
     */
    it('cada entrada tem tooltip com o nome da área', () => {
        const { container } = montar()

        const dicas = [...container.querySelectorAll('[data-tip]')].map((n) => n.getAttribute('data-tip'))
        expect(dicas).toEqual(['Geral', 'SAC'])
    })

    it('clicar numa área pede a abertura dela', () => {
        montar()

        screen.getByRole('button', { name: 'SAC' }).click()

        expect(alternarArea).toHaveBeenCalledWith('sac')
    })

    it('marca a área que contém a rota atual', () => {
        h.ativo = { itemAtivoId: 'tickets', areaAtivaId: 'sac' }
        montar()

        expect(screen.getByRole('button', { name: 'SAC' })).toHaveAttribute('aria-current', 'true')
        expect(screen.getByRole('button', { name: 'Geral' })).not.toHaveAttribute('aria-current')
    })

    it('informa por aria-expanded qual área está com o painel aberto', () => {
        montar('sac')

        expect(screen.getByRole('button', { name: 'SAC' })).toHaveAttribute('aria-expanded', 'true')
        expect(screen.getByRole('button', { name: 'Geral' })).toHaveAttribute('aria-expanded', 'false')
    })

    it('mantém o perfil do usuário no rodapé do trilho', () => {
        montar()

        expect(screen.getByTestId('perfil')).toBeInTheDocument()
    })

    it('ignora área sem ícone em vez de renderizar um buraco', () => {
        const semIcone = [{ id: 'sem-icone', label: 'Sem ícone', items: [] }]
        h.contexto = { filteredMenu: semIcone, menuPorAcesso: semIcone, areaAberta: null, alternarArea }

        render(<RailBar />)

        expect(screen.queryByRole('button', { name: 'Sem ícone' })).not.toBeInTheDocument()
    })

    /**
     * Buscar item não pode remover área: são níveis diferentes de navegação. Quando o trilho lia o
     * menu já filtrado pela busca, digitar algo sem correspondência apagava a navegação inteira.
     */
    it('mantém as áreas durante a busca, mesmo sem resultado', () => {
        h.contexto = { filteredMenu: [], menuPorAcesso: areas, areaAberta: 'sac', alternarArea }

        render(<RailBar />)

        expect(screen.getByRole('button', { name: 'Geral' })).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'SAC' })).toBeInTheDocument()
    })
})
