/** Dados fictícios do padrão de aprovação. */
export interface Solicitacao {
    id: number
    titulo: string
    solicitante: string
    valor: number
    criadaEm: string
    situacao: 'Pendente' | 'Aprovada' | 'Recusada'
    motivo?: string
}

export const solicitacoesIniciais: Solicitacao[] = [
    {
        id: 101,
        titulo: 'Desconto de 12% no pedido 4521',
        solicitante: 'Ana Souza',
        valor: 18450,
        criadaEm: '2026-10-10T09:12:00Z',
        situacao: 'Pendente',
    },
    {
        id: 102,
        titulo: 'Prazo de 90 dias para Gama Indústria',
        solicitante: 'Bruno Lima',
        valor: 52300,
        criadaEm: '2026-10-11T14:40:00Z',
        situacao: 'Pendente',
    },
    {
        id: 103,
        titulo: 'Frete grátis para Delta Comércio',
        solicitante: 'Carla Dias',
        valor: 1280,
        criadaEm: '2026-10-12T08:05:00Z',
        situacao: 'Pendente',
    },
    {
        id: 104,
        titulo: 'Bonificação de 20 caixas',
        solicitante: 'Diego Melo',
        valor: 3400,
        criadaEm: '2026-10-12T16:22:00Z',
        situacao: 'Pendente',
    },
]
