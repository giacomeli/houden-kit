import {
    Button,
    Checkbox,
    FilterDrawer,
    type ILegacyColumn,
    PageHeader,
    SearchInput,
    Select,
    TanStackPaginationBar,
    TanStackTable,
    useLegacyTanStackTable,
} from 'houden-kit'
import { Plus, SlidersHorizontal } from 'houden-kit/icons'
import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { type Cliente, clientes, moeda } from '../../data/clientes'
import { useNavigateWithProgress } from '../../navigation'

interface Filtros {
    segmento: string
    somenteAtivos: boolean
}

const segmentos = [
    { name: 'Todos', value: '' },
    { name: 'Indústria', value: 'Indústria' },
    { name: 'Comércio', value: 'Comércio' },
    { name: 'Serviços', value: 'Serviços' },
    { name: 'Saúde', value: 'Saúde' },
]

const colunas: ILegacyColumn[] = [
    { id: 'nome', name: 'Cliente', selector: (c: Cliente) => c.nome, sortable: true },
    { id: 'cidade', name: 'Cidade', selector: (c: Cliente) => `${c.cidade}/${c.uf}`, sortable: true },
    { id: 'segmento', name: 'Segmento', selector: (c: Cliente) => c.segmento },
    { id: 'pedidos', name: 'Pedidos', selector: (c: Cliente) => c.pedidos, sortable: true },
    {
        id: 'faturamento',
        name: 'Faturamento',
        selector: (c: Cliente) => c.faturamento,
        cell: (c: Cliente) => moeda(c.faturamento),
        sortable: true,
    },
    {
        id: 'status',
        name: 'Status',
        cell: (c: Cliente) => (
            <span
                className={`badge badge-sm ${c.status === 'Ativo' ? 'badge-success' : c.status === 'Inativo' ? 'badge-ghost' : 'badge-info'}`}
            >
                {c.status}
            </span>
        ),
    },
]

/** Padrão `list`: busca, filtros em gaveta, tabela ordenável e paginação. */
export default function Lista() {
    const navegar = useNavigateWithProgress()
    const [busca, setBusca] = useState('')
    const [filtros, setFiltros] = useState<Filtros>({ segmento: '', somenteAtivos: false })
    const [gavetaAberta, setGavetaAberta] = useState(false)
    const { register, handleSubmit, reset } = useForm<Filtros>({ defaultValues: filtros })

    const dados = useMemo(() => {
        const termo = busca.trim().toLowerCase()
        return clientes.filter(
            (c) =>
                (!termo || c.nome.toLowerCase().includes(termo)) &&
                (!filtros.segmento || c.segmento === filtros.segmento) &&
                (!filtros.somenteAtivos || c.status === 'Ativo'),
        )
    }, [busca, filtros])

    const { table, currentPage, pageSize, totalRows, totalPages, goToPage, changePageSize } = useLegacyTanStackTable({
        columns: colunas,
        data: dados,
    })

    return (
        <div className="flex flex-col gap-4">
            <PageHeader
                title="Clientes"
                description={`${dados.length} clientes na carteira`}
                actions={
                    <Button
                        className="btn-success btn-circle"
                        aria-label="Novo cliente"
                        onClick={() => navegar('/padroes/formulario')}
                    >
                        <Plus size={18} strokeWidth={1.75} />
                    </Button>
                }
            />

            <div className="flex flex-wrap items-center gap-2">
                <SearchInput
                    onDebouncedChange={setBusca}
                    placeholder="Buscar cliente"
                    ariaLabel="Buscar cliente"
                    className="w-full max-w-xs"
                />
                <Button className="btn-sm btn-ghost" onClick={() => setGavetaAberta(true)}>
                    <SlidersHorizontal size={16} strokeWidth={1.75} />
                    Filtros
                </Button>
            </div>

            <TanStackTable table={table} onRowClicked={() => navegar('/padroes/detalhe')} />
            <TanStackPaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                totalRows={totalRows}
                pageSize={pageSize}
                onGoToPage={goToPage}
                onChangePageSize={changePageSize}
            />

            <FilterDrawer
                visibleRight={gavetaAberta}
                setVisibleRight={setGavetaAberta}
                handleSubmit={handleSubmit}
                handleData={(dados: Filtros) => {
                    setFiltros(dados)
                    setGavetaAberta(false)
                }}
                handleReset={() => {
                    reset({ segmento: '', somenteAtivos: false })
                    setFiltros({ segmento: '', somenteAtivos: false })
                }}
            >
                <div className="flex flex-col gap-4">
                    <Select labelText="Segmento" options={segmentos} register={register('segmento')} />
                    <div className="flex items-center gap-2 text-sm">
                        <Checkbox id="somente-ativos" register={register('somenteAtivos')} toggle />
                        <label htmlFor="somente-ativos">Somente ativos</label>
                    </div>
                </div>
            </FilterDrawer>
        </div>
    )
}
