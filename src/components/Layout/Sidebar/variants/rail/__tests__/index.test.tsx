import { fireEvent, render, screen } from '@testing-library/react'
import { LifeBuoy } from 'lucide-react'
import type { IMenuSection } from '../../../../../../types/menu'
import SidebarRail from '../index'

const h = vi.hoisted(() => ({
    contexto: {} as Record<string, unknown>,
    ativo: { itemAtivoId: null as string | null, areaAtivaId: null as string | null },
}))

vi.mock('../../../useSidebarContext', () => ({ useSidebarContext: () => h.contexto }))
vi.mock('../../../useActiveMenuItem', () => ({ useActiveMenuItem: () => h.ativo }))

const areas: IMenuSection[] = [
    {
        id: 'sac',
        label: 'SAC',
        icon: LifeBuoy,
        items: [
            {
                id: 'atendimento',
                label: 'Atendimento Clientes',
                searchTerms: ['atendimento'],
                href: '/sac/externo',
            },
        ],
    },
]

const fecharPainel = vi.fn()
const alternarArea = vi.fn()

const montar = (areaAberta: string | null) => {
    h.contexto = {
        filteredMenu: areas,
        menuPorAcesso: areas,
        areaAberta,
        searchTerm: '',
        setSearchTerm: vi.fn(),
        fecharPainel,
        alternarArea,
    }
    return render(<SidebarRail />)
}

describe('variante rail', () => {
    beforeEach(() => vi.clearAllMocks())

    it('com o painel fechado, só o trilho existe no DOM', () => {
        montar(null)

        expect(screen.getByRole('button', { name: 'SAC' })).toBeInTheDocument()
        expect(screen.queryByPlaceholderText('Buscar menu...')).not.toBeInTheDocument()
    })

    it('Escape fecha o painel aberto', () => {
        montar('sac')

        fireEvent.keyDown(document, { key: 'Escape' })

        expect(fecharPainel).toHaveBeenCalled()
    })

    it('Escape não faz nada com o painel já fechado', () => {
        montar(null)

        fireEvent.keyDown(document, { key: 'Escape' })

        expect(fecharPainel).not.toHaveBeenCalled()
    })

    it('outra tecla não fecha', () => {
        montar('sac')

        fireEvent.keyDown(document, { key: 'a' })

        expect(fecharPainel).not.toHaveBeenCalled()
    })

    it('clique fora fecha', () => {
        montar('sac')

        fireEvent.mouseDown(document.body)

        expect(fecharPainel).toHaveBeenCalled()
    })

    it('clique dentro do painel não fecha', () => {
        montar('sac')

        fireEvent.mouseDown(screen.getByPlaceholderText('Buscar menu...'))

        expect(fecharPainel).not.toHaveBeenCalled()
    })

    /**
     * O botão da área já alterna o painel. Se o clique no trilho também fechasse, abrir uma área
     * diferente com o painel aberto fecharia e reabriria no mesmo gesto.
     */
    it('clique no trilho não fecha, porque o botão da área já alterna', () => {
        montar('sac')

        fireEvent.mouseDown(screen.getByRole('button', { name: 'SAC' }))

        expect(fecharPainel).not.toHaveBeenCalled()
    })

    it('remove os listeners ao desmontar', () => {
        const { unmount } = montar('sac')

        unmount()
        fireEvent.keyDown(document, { key: 'Escape' })

        expect(fecharPainel).not.toHaveBeenCalled()
    })
})
