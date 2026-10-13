import { FileText, LayoutGrid, LifeBuoy, ShoppingCart } from 'lucide-react'
import type { ParityCase, ParityCases } from '../types'

// Casos dos componentes adaptados. Os campos `access` só existem para o lado do app de origem (o tipo da lib não
// os tem); a lib recebe o menu por prop e o app de origem, pelo `SIDEBAR_MENU` mockado no setup do gerador.
const access = { public: true }
const MENU = [
    {
        id: 'main',
        label: 'Geral',
        icon: LayoutGrid,
        access,
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                searchTerms: ['dashboard'],
                href: '/dashboard',
                icon: LayoutGrid,
                access,
            },
        ],
    },
    {
        id: 'vendas',
        label: 'Vendas',
        icon: ShoppingCart,
        showDivider: true,
        access,
        items: [
            {
                id: 'pedidos',
                label: 'Pedidos',
                searchTerms: ['pedidos'],
                href: '/vendas/pedidos',
                icon: FileText,
                access,
            },
            {
                id: 'cadastros',
                label: 'Cadastros',
                searchTerms: ['cadastros'],
                icon: FileText,
                access,
                children: [
                    { id: 'clientes', label: 'Clientes', searchTerms: ['clientes'], href: '/vendas/clientes', access },
                    { id: 'produtos', label: 'Produtos', searchTerms: ['produtos'], href: '/vendas/produtos', access },
                ],
            },
        ],
    },
    {
        id: 'sac',
        label: 'SAC',
        icon: LifeBuoy,
        showDivider: true,
        access,
        items: [{ id: 'tickets', label: 'Tickets', searchTerms: ['tickets', 'atendimento'], href: '/tickets', access }],
    },
]

const parity = globalThis as any
const noop = () => {}
const PROFILE = 'Layout/Sidebar/SidebarUserProfile'
// Cada lado grava a variante na própria chave de armazenamento (`CHAVE_VARIANTE` do módulo de cada lado).
const VARIANT = 'Layout/Sidebar/useSidebarVariant'

function sidebarCase(
    name: string,
    pathname: string,
    {
        rail = false,
        collapsed = false,
        interact,
    }: Pick<ParityCase, 'interact'> & { rail?: boolean; collapsed?: boolean } = {},
): ParityCase {
    return {
        name,
        with: [PROFILE, VARIANT],
        before: () => {
            parity.__parityPathname = pathname
            if (!parity.__parityMenu) parity.__parityMenu = []
            parity.__parityMenu.splice(0, Number.POSITIVE_INFINITY, ...MENU)
        },
        after: () => localStorage.clear(),
        // O app de origem ignora as props (lê tudo de hooks); a lib recebe por prop o mesmo que o app de origem lê.
        render: ({ default: Sidebar }, deps) => {
            if (rail) localStorage.setItem(deps[VARIANT].CHAVE_VARIANTE, 'rail')
            const Profile = deps[PROFILE].default
            return (
                <Sidebar
                    menu={MENU}
                    pathname={pathname}
                    isCollapsed={collapsed}
                    logo={<i data-parity-slot="logo" />}
                    userProfile={({ isSidebarFullWidth }: { isSidebarFullWidth: boolean }) => (
                        <Profile
                            isSidebarFullWidth={isSidebarFullWidth}
                            email="ana.souza@houden.com.br"
                            onSignOut={noop}
                        />
                    )}
                />
            )
        },
        interact,
    }
}

const cases: ParityCases = {
    'Layout/Sidebar': [
        sidebarCase('legacy', '/vendas/pedidos'),
        // No app de origem, a rota de conversas recolhe a barra; na lib, a prop `isCollapsed`.
        sidebarCase('legacy-recolhida', '/vendas/conversas', { collapsed: true }),
        sidebarCase('legacy-com-busca', '/vendas/pedidos', {
            interact: async ({ user, screen }) => {
                await user.type(screen.getByPlaceholderText('Buscar menu...'), 'clien')
            },
        }),
        sidebarCase('rail', '/vendas/clientes', { rail: true }),
        sidebarCase('rail-com-painel', '/vendas/clientes', {
            rail: true,
            interact: async ({ user, screen }) => {
                await user.click(screen.getByRole('button', { name: 'Vendas' }))
            },
        }),
    ],
    'Layout/Loader': [{ name: 'padrao', render: ({ default: Loader }) => <Loader /> }],
    'Layout/RouteProgressBar': [
        {
            name: 'padrao',
            before: () => {
                parity.__parityPathname = '/'
            },
            render: ({ default: RouteProgressBar }) => <RouteProgressBar pathname="/" />,
        },
    ],
}

export default cases
