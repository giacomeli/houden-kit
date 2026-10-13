/** Dados fictícios do painel. */
const meses = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out']

export const vendasPorMes = {
    labels: meses,
    datasets: [{ label: 'Vendas (R$ mil)', data: [182, 205, 198, 241, 263, 279] }],
}

export const pedidosPorMes = {
    labels: meses,
    datasets: [
        { label: 'Pedidos', data: [310, 342, 330, 388, 401, 425] },
        { label: 'Cancelados', data: [12, 9, 15, 11, 8, 7] },
    ],
}

export const vendasPorSegmento = {
    labels: ['Indústria', 'Comércio', 'Serviços', 'Saúde'],
    datasets: [{ data: [41, 27, 18, 14] }],
}
