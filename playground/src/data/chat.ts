/** Conversa fictícia com o agente. */
export interface Mensagem {
    id: number
    autor: 'usuario' | 'agente'
    texto: string
    criadaEm: string
}

export const conversaInicial: Mensagem[] = [
    {
        id: 1,
        autor: 'agente',
        texto: 'Olá! Sou o agente de vendas. Posso consultar **pedidos**, **clientes** e **metas**.',
        criadaEm: '2026-10-13T13:58:00Z',
    },
    { id: 2, autor: 'usuario', texto: 'Quais clientes mais compraram este mês?', criadaEm: '2026-10-13T13:59:00Z' },
    {
        id: 3,
        autor: 'agente',
        texto: 'Os três maiores de outubro:\n\n| Cliente | Pedidos | Faturamento |\n| --- | --- | --- |\n| Gama Indústria 3 | 27 | R$ 312.400,00 |\n| Alfa Distribuidora 1 | 21 | R$ 268.900,00 |\n| Sigma Hospitalar 2 | 18 | R$ 201.150,00 |\n\nVeja os detalhes na [tela de clientes](/padroes/lista).',
        criadaEm: '2026-10-13T13:59:30Z',
    },
]

/** Resposta fictícia, devolvida em partes para simular o streaming do agente. */
export function respostaDoAgente(pergunta: string): string {
    return `Recebi: _${pergunta}_.\n\nEste é um playground, então a resposta é fictícia. No app real, o texto chega do agente em partes, como aqui:\n\n- consulta ao ERP\n- cálculo das metas\n- resumo em Markdown`
}
