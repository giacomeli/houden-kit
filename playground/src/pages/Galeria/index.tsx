import {
    Alert,
    Aside,
    Avatar,
    Button,
    Chart,
    ChartCard,
    ChatBubble,
    ChatComposer,
    ChatMessageList,
    Checkbox,
    ConfirmDialog,
    ContextPanel,
    DashboardCard,
    DatePicker,
    FilterDrawer,
    FormError,
    InputCurrency,
    Label,
    LiMenu,
    Logo,
    MarkdownContent,
    MessageTimestamp,
    Modal,
    MultiSelect,
    PageHeader,
    PanelItem,
    RailBar,
    RailItem,
    SearchInput,
    SidebarMenu,
    SidebarProvider,
    SidebarUserProfile,
    startLoading,
    stopLoading,
    TanStackPaginationBar,
    TanStackTable,
    TextArea,
    Tooltip,
    toastError,
    toastSuccess,
    UlMenu,
    useLegacyTanStackTable,
    useSidebarContext,
} from 'houden-kit'
import { Bell, Info, ShoppingCart } from 'houden-kit/icons'
import { type ReactNode, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { clientes, moeda } from '../../data/clientes'
import { menu } from '../../data/menu'
import { vendasPorMes } from '../../data/painel'
import { RouterLink } from '../../RouterLink'

function Secao({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
    return (
        <section aria-labelledby={id} className="flex flex-col gap-4">
            <h2 id={id} className="text-lg font-semibold border-b border-base-300 pb-1">
                {titulo}
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">{children}</div>
        </section>
    )
}

function Exemplo({ nome, children, largo = false }: { nome: string; children: ReactNode; largo?: boolean }) {
    return (
        <div className={`rounded-box border border-base-300 p-4 ${largo ? 'lg:col-span-2' : ''}`}>
            <p className="mb-3 font-mono text-xs opacity-60">{nome}</p>
            <div className="flex flex-col gap-3">{children}</div>
        </div>
    )
}

function FormularioGaleria() {
    const { control, register } = useForm({ defaultValues: { data: '2026-10-13', valor: 1234.5, areas: [] } })
    return (
        <>
            <Exemplo nome="Button">
                <div className="flex flex-wrap gap-2">
                    <Button>Padrão</Button>
                    <Button className="btn-primary">Primário</Button>
                    <Button className="btn-error btn-outline">Excluir</Button>
                    <Button isLoading>Salvando</Button>
                    <Button disabled>Desabilitado</Button>
                </div>
            </Exemplo>
            <Exemplo nome="Checkbox, Label, FormError">
                <Label labelText="Aceite" tooltipText="Necessário para continuar" tooltipContent="?">
                    <span className="flex items-center gap-2 font-normal">
                        <Checkbox register={register('aceite' as never)} /> Li os termos
                    </span>
                </Label>
                <span className="flex items-center gap-2 text-sm">
                    <Checkbox toggle defaultChecked /> Alternador
                </span>
                <FormError>Campo obrigatório</FormError>
            </Exemplo>
            <Exemplo nome="DatePicker, InputCurrency">
                <DatePicker name="data" control={control} />
                <InputCurrency name="valor" control={control} />
            </Exemplo>
            <Exemplo nome="TextArea, MultiSelect, SearchInput">
                <TextArea placeholder="Observações" />
                <MultiSelect
                    name="areas"
                    control={control}
                    options={[
                        { name: 'Vendas', code: 'vendas' },
                        { name: 'SAC', code: 'sac' },
                    ]}
                />
                <SearchInput onDebouncedChange={() => {}} placeholder="Buscar" ariaLabel="Buscar" />
            </Exemplo>
            <Exemplo nome="Demais campos" largo>
                <p className="text-sm">
                    Input, Select, SearchSelect, MultiSearchSelect, MaskedInput, InputChips, InputFile e os grupos
                    (DatePickerFormGroup, DatePickerGroup, InputCurrencyFormGroup, MultiSelectFormGroup,
                    TextAreaFormGroup) aparecem juntos no padrão{' '}
                    <RouterLink href="/padroes/formulario" className="link link-primary">
                        Formulário
                    </RouterLink>
                    .
                </p>
            </Exemplo>
        </>
    )
}

function TabelaGaleria() {
    const { table, currentPage, pageSize, totalRows, totalPages, goToPage, changePageSize } = useLegacyTanStackTable({
        columns: [
            { id: 'nome', name: 'Cliente', selector: (c) => c.nome, sortable: true },
            {
                id: 'faturamento',
                name: 'Faturamento',
                selector: (c) => c.faturamento,
                cell: (c) => moeda(c.faturamento),
                sortable: true,
            },
        ],
        data: clientes.slice(0, 12),
        paginationPerPage: 5,
    })
    return (
        <Exemplo nome="TanStackTable, TanStackPaginationBar, useLegacyTanStackTable" largo>
            <TanStackTable table={table} />
            <TanStackPaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                totalRows={totalRows}
                pageSize={pageSize}
                onGoToPage={goToPage}
                onChangePageSize={changePageSize}
                itensPerPageOption={[5, 10, 20]}
            />
        </Exemplo>
    )
}

function LayoutGaleria() {
    const [modal, setModal] = useState(false)
    const [gaveta, setGaveta] = useState(false)
    const [confirmar, setConfirmar] = useState(false)
    const { handleSubmit } = useForm()
    return (
        <>
            <Exemplo nome="PageHeader">
                <PageHeader
                    title="Título da tela"
                    description="Descrição curta"
                    actions={<Button className="btn-sm">Ação</Button>}
                />
            </Exemplo>
            <Exemplo nome="Alert, Tooltip, Avatar">
                <Alert
                    message="Mensagem de alerta"
                    icon={<Info size={18} strokeWidth={1.75} />}
                    className="alert-info"
                />
                <div className="flex items-center gap-4">
                    <Tooltip text="Dica do componente">
                        <span className="underline decoration-dotted">passe o ponteiro</span>
                    </Tooltip>
                    <Avatar className="avatar-placeholder">
                        <div className="w-10 rounded-full bg-accent text-accent-content">
                            <span>HK</span>
                        </div>
                    </Avatar>
                </div>
            </Exemplo>
            <Exemplo nome="Modal, FilterDrawer, ConfirmDialog">
                <div className="flex flex-wrap gap-2">
                    <Button className="btn-sm" onClick={() => setModal(true)}>
                        Abrir modal
                    </Button>
                    <Button className="btn-sm" onClick={() => setGaveta(true)}>
                        Abrir filtros
                    </Button>
                    <Button className="btn-sm btn-error" onClick={() => setConfirmar(true)}>
                        Confirmar exclusão
                    </Button>
                </div>
                <Modal isOpen={modal} onClose={() => setModal(false)} headerText="Modal" className="w-full max-w-md">
                    <p className="text-sm">Conteúdo do modal.</p>
                </Modal>
                <FilterDrawer
                    visibleRight={gaveta}
                    setVisibleRight={setGaveta}
                    handleSubmit={handleSubmit}
                    handleData={() => setGaveta(false)}
                    handleReset={() => {}}
                >
                    <p className="text-sm">Campos de filtro.</p>
                </FilterDrawer>
                <ConfirmDialog
                    open={confirmar}
                    title="Excluir registro"
                    description="A ação não pode ser desfeita."
                    tone="error"
                    confirmLabel="Excluir"
                    reason={{ label: 'Motivo', required: true }}
                    onCancel={() => setConfirmar(false)}
                    onConfirm={(motivo) => {
                        setConfirmar(false)
                        toastSuccess(`Excluído. Motivo: ${motivo}`, 3000)
                    }}
                />
            </Exemplo>
            <Exemplo nome="Logo (completo e compacto)">
                <div className="flex items-center gap-4 rounded-box bg-primary p-4">
                    <Logo />
                    <Logo compact />
                </div>
            </Exemplo>
        </>
    )
}

function NavegacaoGaleria() {
    const [aberta, setAberta] = useState(true)
    const [vendas] = menu.filter((s) => s.id === 'padroes')
    return (
        <>
            <Exemplo nome="Aside, UlMenu, LiMenu, SidebarMenu">
                <Aside className="rounded-box bg-primary p-2">
                    <UlMenu className="menu w-full text-white [&_a]:!text-white">
                        <LiMenu>
                            <RouterLink href="/">Item simples</RouterLink>
                        </LiMenu>
                        <SidebarMenu items={vendas.items.slice(0, 3)} isSidebarFullWidth isSearching={false} />
                    </UlMenu>
                </Aside>
            </Exemplo>
            <Exemplo nome="RailItem, PanelItem, SidebarUserProfile">
                <SidebarProvider menu={menu} pathname="/padroes/lista" linkComponent={RouterLink}>
                    <div className="flex items-start gap-4 rounded-box bg-primary p-3">
                        <RailItem area={vendas} ativa aberta={aberta} onSelecionar={() => setAberta(!aberta)} />
                        <ul className="flex-1">
                            <PanelItem item={vendas.items[0]} itemAtivoId="lista" onNavegar={() => {}} />
                            <PanelItem item={vendas.items[1]} itemAtivoId="lista" onNavegar={() => {}} />
                        </ul>
                    </div>
                    <div className="mt-2 rounded-box bg-primary">
                        <SidebarUserProfile isSidebarFullWidth email="ana.souza@exemplo.com.br" onSignOut={() => {}} />
                    </div>
                </SidebarProvider>
            </Exemplo>
            <Exemplo nome="RailBar e ContextPanel (trilho com o painel da área aberto)" largo>
                {/* O `transform` cria o bloco de contenção dos elementos fixos e sticky do trilho. */}
                <div className="relative h-96 overflow-hidden rounded-box [transform:translateZ(0)]">
                    <SidebarProvider menu={menu} pathname="/padroes/lista" linkComponent={RouterLink}>
                        <AbrirAreaAoMontar id="padroes" />
                        <div className="flex">
                            <RailBar />
                            <ContextPanel />
                        </div>
                    </SidebarProvider>
                </div>
            </Exemplo>
        </>
    )
}

/**
 * Abre a área uma vez, ao montar, para o ContextPanel aparecer na galeria. O `alternarArea` alterna; o
 * ref evita que o efeito duplicado do StrictMode feche o painel logo depois de abrir.
 */
function AbrirAreaAoMontar({ id }: { id: string }) {
    const { alternarArea } = useSidebarContext()
    const aberta = useRef(false)
    useEffect(() => {
        if (aberta.current) return
        aberta.current = true
        alternarArea(id)
    }, [alternarArea, id])
    return null
}

function PainelGaleria() {
    return (
        <>
            <Exemplo nome="DashboardCard">
                <DashboardCard
                    icon={<ShoppingCart size={22} strokeWidth={1.75} />}
                    title="Pedidos"
                    description="Pedidos emitidos no mês"
                    value="425"
                />
            </Exemplo>
            <Exemplo nome="ChartCard, Chart">
                <ChartCard title="Vendas por mês">
                    <Chart type="bar" data={vendasPorMes} />
                </ChartCard>
            </Exemplo>
        </>
    )
}

function ChatGaleria() {
    return (
        <Exemplo nome="ChatMessageList, ChatBubble, MarkdownContent, MessageTimestamp, ChatComposer" largo>
            <ChatMessageList className="max-h-72 rounded-box bg-base-200 p-2">
                <ChatBubble side="start" author="Agente" timestamp="2026-10-13T14:30:00Z">
                    <MarkdownContent>{'Resposta com **Markdown** e [link](https://exemplo.com.br).'}</MarkdownContent>
                </ChatBubble>
                <ChatBubble side="end" timestamp="2026-10-13T14:31:00Z">
                    Mensagem do usuário
                </ChatBubble>
            </ChatMessageList>
            <p className="text-xs">
                Hora isolada: <MessageTimestamp createdAt="2026-10-13T14:30:00Z" /> (clique para ver data completa)
            </p>
            <ChatComposer onSend={(texto) => toastSuccess(`Enviado: ${texto}`, 3000)} />
        </Exemplo>
    )
}

function UtilitariosGaleria() {
    return (
        <Exemplo nome="toastSuccess, toastError, Loader (startLoading/stopLoading)" largo>
            <div className="flex flex-wrap gap-2">
                <Button className="btn-sm btn-success" onClick={() => toastSuccess('Operação concluída.', 3000)}>
                    <Bell size={16} strokeWidth={1.75} /> Toast de sucesso
                </Button>
                <Button className="btn-sm btn-error" onClick={() => toastError('Algo deu errado.', 3000)}>
                    Toast de erro
                </Button>
                <Button
                    className="btn-sm"
                    onClick={() => {
                        startLoading()
                        window.setTimeout(stopLoading, 1500)
                    }}
                >
                    Loader por 1,5 s
                </Button>
            </div>
        </Exemplo>
    )
}

/** Galeria: cada componente exportado pela lib, com as variantes principais. */
export default function Galeria() {
    return (
        <div className="flex flex-col gap-10">
            <PageHeader title="Galeria de componentes" description="houden-kit: React, Tailwind CSS 4 e DaisyUI 5." />
            <Secao id="formulario" titulo="Formulário">
                <FormularioGaleria />
            </Secao>
            <Secao id="tabela" titulo="Tabela">
                <TabelaGaleria />
            </Secao>
            <Secao id="layout" titulo="Layout">
                <LayoutGaleria />
            </Secao>
            <Secao id="navegacao" titulo="Navegação">
                <NavegacaoGaleria />
            </Secao>
            <Secao id="painel" titulo="Painel">
                <PainelGaleria />
            </Secao>
            <Secao id="chat" titulo="Chat">
                <ChatGaleria />
            </Secao>
            <Secao id="utilitarios" titulo="Utilitários">
                <UtilitariosGaleria />
            </Secao>
        </div>
    )
}
