import { Alert, Avatar, Button, ConfirmDialog, DashboardCard, PageHeader, Tooltip, toastSuccess } from 'houden-kit'
import { Info, Pencil, ShoppingCart, Trash2, TrendingUp } from 'houden-kit/icons'
import { useState } from 'react'
import { clientes, moeda } from '../../data/clientes'
import { useNavigateWithProgress } from '../../navigation'

const cliente = clientes[2]

/** Padrão `detail`: cabeçalho com ações, dados agrupados em cartões e indicadores. */
export default function Detalhe() {
    const navegar = useNavigateWithProgress()
    const [confirmarExclusao, setConfirmarExclusao] = useState(false)

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title={cliente.nome}
                description={`Cliente desde 2019 · ${cliente.cidade}/${cliente.uf}`}
                actions={
                    <>
                        <Button className="btn-sm btn-ghost" onClick={() => navegar('/padroes/formulario')}>
                            <Pencil size={16} strokeWidth={1.75} />
                            Editar
                        </Button>
                        <Button className="btn-sm btn-error btn-outline" onClick={() => setConfirmarExclusao(true)}>
                            <Trash2 size={16} strokeWidth={1.75} />
                            Excluir
                        </Button>
                    </>
                }
            />

            <Alert
                message="Cliente com limite de crédito próximo do teto (92% usado)."
                icon={<Info size={18} strokeWidth={1.75} />}
                className="alert-warning"
            />

            <div className="grid gap-4 md:grid-cols-3">
                <DashboardCard
                    icon={<ShoppingCart size={22} strokeWidth={1.75} />}
                    title="Pedidos no ano"
                    description="Pedidos faturados desde janeiro"
                    value={String(cliente.pedidos)}
                />
                <DashboardCard
                    icon={<TrendingUp size={22} strokeWidth={1.75} />}
                    title="Faturamento"
                    description="Soma dos pedidos faturados no ano"
                    value={moeda(cliente.faturamento)}
                />
                <DashboardCard
                    icon={<Info size={22} strokeWidth={1.75} />}
                    title="Segmento"
                    description="Classificação comercial do cliente"
                    value={cliente.segmento}
                />
            </div>

            <div className="card bg-base-200">
                <div className="card-body gap-4">
                    <h2 className="card-title text-base">Contatos</h2>
                    <ul className="flex flex-col gap-3">
                        {[
                            ['MS', 'Marina Silva', 'Compras'],
                            ['RT', 'Rafael Torres', 'Financeiro'],
                        ].map(([iniciais, nome, area]) => (
                            <li key={nome} className="flex items-center gap-3">
                                <Avatar className="avatar-placeholder">
                                    <div className="bg-accent text-accent-content w-10 rounded-full">
                                        <span className="text-sm">{iniciais}</span>
                                    </div>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-semibold">{nome}</p>
                                    <Tooltip text="Área responsável pelo contato" className="tooltip-right">
                                        <p className="text-xs opacity-70">{area}</p>
                                    </Tooltip>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <ConfirmDialog
                open={confirmarExclusao}
                title="Excluir cliente"
                description={`${cliente.nome} sai da carteira. A ação não pode ser desfeita.`}
                confirmLabel="Excluir"
                tone="error"
                onCancel={() => setConfirmarExclusao(false)}
                onConfirm={() => {
                    setConfirmarExclusao(false)
                    toastSuccess('Cliente excluído (fictício).', 3000)
                }}
            />
        </div>
    )
}
