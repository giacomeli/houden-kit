import {
    type ColumnDef,
    getCoreRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
} from '@tanstack/react-table'
import type { ComponentType } from 'react'
import { FormHarness } from '../harness'
import type { ParityCases } from '../types'

interface Cliente {
    nome: string
    cidade: string
    pedidos: number
}

const clientes: Cliente[] = [
    { nome: 'Alfa Distribuidora', cidade: 'Curitiba', pedidos: 12 },
    { nome: 'Beta Comércio', cidade: 'Joinville', pedidos: 3 },
    { nome: 'Gama Indústria', cidade: 'Londrina', pedidos: 27 },
]

const colunas: ColumnDef<Cliente>[] = [
    { accessorKey: 'nome', header: 'Nome' },
    { accessorKey: 'cidade', header: 'Cidade', enableSorting: false },
    { accessorKey: 'pedidos', header: 'Pedidos', size: 80 },
]

/** Monta a instância da tabela com o @tanstack/react-table de cada lado da paridade (mesma versão 8.x). */
function TableHarness({
    TanStackTable,
    data = clientes,
    sorting = [],
    ...props
}: {
    TanStackTable: ComponentType<any>
    data?: Cliente[]
    sorting?: SortingState
    [key: string]: unknown
}) {
    const table = useReactTable({
        data,
        columns: colunas,
        state: { sorting },
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })
    return <TanStackTable table={table} {...props} />
}

const Detalhe = ({ data }: { data: Cliente }) => <p>Pedidos de {data.nome}</p>
const noop = () => {}

const cases: ParityCases = {
    TanStackTable: [
        { name: 'com-dados', render: ({ default: T }) => <TableHarness TanStackTable={T} className="mt-2" /> },
        { name: 'vazia', render: ({ default: T }) => <TableHarness TanStackTable={T} data={[]} /> },
        { name: 'carregando', render: ({ default: T }) => <TableHarness TanStackTable={T} isLoading /> },
        {
            name: 'ordenada-crescente',
            render: ({ default: T }) => <TableHarness TanStackTable={T} sorting={[{ id: 'nome', desc: false }]} />,
        },
        {
            name: 'ordenada-decrescente',
            render: ({ default: T }) => <TableHarness TanStackTable={T} sorting={[{ id: 'pedidos', desc: true }]} />,
        },
        {
            name: 'expansivel',
            render: ({ default: T }) => (
                <TableHarness TanStackTable={T} expandable expandableRowsComponent={Detalhe} onRowClicked={noop} />
            ),
        },
        {
            name: 'expansivel-aberta',
            render: ({ default: T }) => (
                <TableHarness TanStackTable={T} expandable expandableRowsComponent={Detalhe} expandedRow />
            ),
        },
    ],
    'TanStackTable/TanStackPaginationBar': [
        {
            name: 'primeira-pagina',
            render: ({ default: Bar }) => (
                <Bar
                    currentPage={1}
                    totalPages={5}
                    totalRows={48}
                    pageSize={10}
                    onGoToPage={noop}
                    onChangePageSize={noop}
                />
            ),
        },
        {
            name: 'pagina-intermediaria',
            render: ({ default: Bar }) => (
                <Bar
                    currentPage={3}
                    totalPages={5}
                    totalRows={48}
                    pageSize={10}
                    onGoToPage={noop}
                    onChangePageSize={noop}
                    itensPerPageOption={[10, 25, 50]}
                    className="mt-4"
                />
            ),
        },
        {
            name: 'ultima-pagina',
            render: ({ default: Bar }) => (
                <Bar
                    currentPage={5}
                    totalPages={5}
                    totalRows={48}
                    pageSize={10}
                    onGoToPage={noop}
                    onChangePageSize={noop}
                />
            ),
        },
    ],
    'Layout/Modal': [
        {
            name: 'aberto',
            render: ({ default: Modal }) => (
                <Modal isOpen onClose={noop}>
                    <p>Conteúdo do modal</p>
                </Modal>
            ),
        },
        {
            name: 'aberto-com-titulo',
            render: ({ default: Modal }) => (
                <Modal isOpen onClose={noop} headerText="Editar cliente" className="w-96">
                    <p>Conteúdo do modal</p>
                </Modal>
            ),
        },
        {
            name: 'fechado',
            render: ({ default: Modal }) => (
                <Modal isOpen={false} onClose={noop}>
                    <p>Conteúdo do modal</p>
                </Modal>
            ),
        },
    ],
    'Layout/Avatar': [
        { name: 'padrao', render: ({ default: Avatar }) => <Avatar>JG</Avatar> },
        { name: 'com-classe', render: ({ default: Avatar }) => <Avatar className="w-12 bg-accent">AB</Avatar> },
    ],
    'Layout/FilterDrawer': [
        {
            name: 'aberto',
            render: ({ default: FilterDrawer }) => (
                <FormHarness>
                    {({ handleSubmit }) => (
                        <FilterDrawer
                            visibleRight
                            setVisibleRight={noop}
                            handleSubmit={handleSubmit}
                            handleData={noop}
                            handleReset={noop}
                        >
                            <p>Campos de filtro</p>
                        </FilterDrawer>
                    )}
                </FormHarness>
            ),
        },
        {
            name: 'aberto-carregando',
            render: ({ default: FilterDrawer }) => (
                <FormHarness>
                    {({ handleSubmit }) => (
                        <FilterDrawer
                            visibleRight
                            setVisibleRight={noop}
                            handleSubmit={handleSubmit}
                            handleData={noop}
                            handleReset={noop}
                            isLoading
                        >
                            <p>Campos de filtro</p>
                        </FilterDrawer>
                    )}
                </FormHarness>
            ),
        },
        {
            name: 'fechado',
            render: ({ default: FilterDrawer }) => (
                <FormHarness>
                    {({ handleSubmit }) => (
                        <FilterDrawer
                            visibleRight={false}
                            setVisibleRight={noop}
                            handleSubmit={handleSubmit}
                            handleData={noop}
                            handleReset={noop}
                        >
                            <p>Campos de filtro</p>
                        </FilterDrawer>
                    )}
                </FormHarness>
            ),
        },
    ],
    'Layout/Aside': [
        {
            name: 'padrao',
            render: ({ default: Aside }) => (
                <Aside className="w-64">
                    <p>Menu</p>
                </Aside>
            ),
        },
    ],
    'Layout/UlMenu': [
        {
            name: 'padrao',
            render: ({ default: UlMenu }) => (
                <UlMenu className="gap-1">
                    <li>Item</li>
                </UlMenu>
            ),
        },
    ],
    'Layout/LiMenu': [
        {
            name: 'simples',
            render: ({ default: LiMenu }) => (
                <ul>
                    <LiMenu>
                        <a href="/inicio">Início</a>
                    </LiMenu>
                </ul>
            ),
        },
        {
            name: 'com-submenu-aberto',
            render: ({ default: LiMenu }) => (
                <ul>
                    <LiMenu hasSubMenu parentName="Vendas" parentIcon={<span>V</span>} isOpen isSidebarFullWidth>
                        <li>
                            <a href="/vendas/pedidos">Pedidos</a>
                        </li>
                    </LiMenu>
                </ul>
            ),
        },
        {
            name: 'com-submenu-recolhido',
            render: ({ default: LiMenu }) => (
                <ul>
                    <LiMenu hasSubMenu parentName="Vendas" parentIcon={<span>V</span>} isSidebarFullWidth={false}>
                        <li>
                            <a href="/vendas/pedidos">Pedidos</a>
                        </li>
                    </LiMenu>
                </ul>
            ),
        },
    ],
    'Dashboard/DashboardCard': [
        {
            name: 'padrao',
            render: ({ default: DashboardCard }) => (
                <DashboardCard
                    icon={<span>R$</span>}
                    title="Faturamento"
                    description="Soma das vendas do período"
                    value="R$ 120.000,00"
                />
            ),
        },
    ],
    'Dashboard/ChartCard': [
        {
            name: 'recolhido',
            render: ({ default: ChartCard }) => (
                <ChartCard title="Vendas por mês">
                    <div>gráfico</div>
                </ChartCard>
            ),
        },
        {
            name: 'expandido',
            render: ({ default: ChartCard }) => (
                <ChartCard title="Vendas por mês" className="min-h-64">
                    <div>gráfico</div>
                </ChartCard>
            ),
            interact: async ({ user }) => {
                await user.click(document.querySelector('svg') as Element)
            },
        },
    ],
    Chart: [
        {
            name: 'barras',
            render: ({ default: Chart }) => (
                <Chart type="bar" data={{ labels: ['Jan'], datasets: [{ data: [1] }] }} className="h-64" />
            ),
        },
    ],
    'Chat/MessageTimestamp': [
        {
            name: 'padrao',
            render: ({ default: MessageTimestamp }) => <MessageTimestamp createdAt="2026-10-13T14:30:00Z" />,
        },
    ],
}

export default cases
