/** Dados fictícios. */
export interface Cliente {
    id: number
    nome: string
    cidade: string
    uf: string
    segmento: 'Indústria' | 'Comércio' | 'Serviços' | 'Saúde'
    pedidos: number
    faturamento: number
    status: 'Ativo' | 'Inativo' | 'Prospecção'
}

const nomes = ['Alfa', 'Beta', 'Gama', 'Delta', 'Épsilon', 'Zeta', 'Ômega', 'Sigma', 'Kappa', 'Lambda']
const sufixos = ['Distribuidora', 'Comércio', 'Indústria', 'Hospitalar', 'Serviços', 'Atacado']
const cidades: Array<[string, string]> = [
    ['Curitiba', 'PR'],
    ['Joinville', 'SC'],
    ['Londrina', 'PR'],
    ['Porto Alegre', 'RS'],
    ['Campinas', 'SP'],
    ['Belo Horizonte', 'MG'],
]
const segmentos: Cliente['segmento'][] = ['Indústria', 'Comércio', 'Serviços', 'Saúde']
const status: Cliente['status'][] = ['Ativo', 'Ativo', 'Ativo', 'Inativo', 'Prospecção']

export const clientes: Cliente[] = Array.from({ length: 120 }, (_, i) => {
    const [cidade, uf] = cidades[i % cidades.length]
    return {
        id: i + 1,
        nome: `${nomes[i % nomes.length]} ${sufixos[(i * 7) % sufixos.length]} ${Math.floor(i / 10) + 1}`,
        cidade,
        uf,
        segmento: segmentos[(i * 3) % segmentos.length],
        pedidos: (i * 37) % 90,
        faturamento: ((i * 7919) % 500000) + 12000,
        status: status[i % status.length],
    }
})

export const moeda = (valor: number) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
