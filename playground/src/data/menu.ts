import type { IMenuSection } from 'houden-kit'
import {
    CheckCheck,
    FileText,
    LayoutDashboard,
    LayoutGrid,
    List,
    MessagesSquare,
    PanelsTopLeft,
    Shapes,
    SquarePen,
} from 'houden-kit/icons'

/** Menu do playground, já "filtrado por permissão": a lib não conhece regra de acesso. */
export const menu: IMenuSection[] = [
    {
        id: 'galeria',
        label: 'Galeria',
        icon: Shapes,
        items: [
            {
                id: 'componentes',
                label: 'Componentes',
                searchTerms: ['componentes', 'galeria'],
                href: '/',
                icon: Shapes,
            },
        ],
    },
    {
        id: 'padroes',
        label: 'Padrões de tela',
        icon: LayoutGrid,
        showDivider: true,
        items: [
            {
                id: 'lista',
                label: 'Lista',
                searchTerms: ['lista', 'list', 'tabela'],
                href: '/padroes/lista',
                icon: List,
            },
            {
                id: 'detalhe',
                label: 'Detalhe',
                searchTerms: ['detalhe', 'detail'],
                href: '/padroes/detalhe',
                icon: FileText,
            },
            {
                id: 'formulario',
                label: 'Formulário',
                searchTerms: ['formulario', 'form', 'cadastro'],
                href: '/padroes/formulario',
                icon: SquarePen,
            },
            {
                id: 'aprovacao',
                label: 'Aprovação',
                searchTerms: ['aprovacao', 'approval'],
                href: '/padroes/aprovacao',
                icon: CheckCheck,
            },
            {
                id: 'painel',
                label: 'Painel',
                searchTerms: ['painel', 'dashboard'],
                href: '/padroes/painel',
                icon: LayoutDashboard,
            },
            { id: 'chat', label: 'Chat', searchTerms: ['chat', 'agente'], href: '/padroes/chat', icon: MessagesSquare },
            {
                id: 'personalizado',
                label: 'Personalizado',
                searchTerms: ['personalizado', 'custom'],
                href: '/padroes/personalizado',
                icon: PanelsTopLeft,
            },
        ],
    },
]
