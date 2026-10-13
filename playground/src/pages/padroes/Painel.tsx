import { Chart, ChartCard, DashboardCard, PageHeader } from 'houden-kit'
import { DollarSign, PackageCheck, Target, Users } from 'houden-kit/icons'
import { pedidosPorMes, vendasPorMes, vendasPorSegmento } from '../../data/painel'

/** Padrão `dashboard`: indicadores e gráficos. */
export default function Painel() {
    return (
        <div className="flex flex-col gap-6">
            <PageHeader title="Painel comercial" description="Outubro de 2026 (dados fictícios)." />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <DashboardCard
                    icon={<DollarSign size={22} strokeWidth={1.75} />}
                    title="Faturamento"
                    description="Pedidos faturados no mês"
                    value="R$ 279.000,00"
                />
                <DashboardCard
                    icon={<PackageCheck size={22} strokeWidth={1.75} />}
                    title="Pedidos"
                    description="Pedidos emitidos no mês"
                    value="425"
                />
                <DashboardCard
                    icon={<Users size={22} strokeWidth={1.75} />}
                    title="Clientes ativos"
                    description="Clientes com pedido nos últimos 90 dias"
                    value="72"
                />
                <DashboardCard
                    icon={<Target size={22} strokeWidth={1.75} />}
                    title="Meta"
                    description="Percentual da meta mensal atingido"
                    value="93%"
                />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <ChartCard title="Vendas por mês">
                    <Chart type="bar" data={vendasPorMes} />
                </ChartCard>
                <ChartCard title="Pedidos e cancelamentos">
                    <Chart type="line" data={pedidosPorMes} />
                </ChartCard>
                <ChartCard title="Vendas por segmento">
                    <Chart type="doughnut" data={vendasPorSegmento} />
                </ChartCard>
            </div>
        </div>
    )
}
