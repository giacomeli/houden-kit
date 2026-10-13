import { Avatar, Button, Modal, PageHeader, Tooltip } from 'houden-kit'
import { Plus } from 'houden-kit/icons'
import { useState } from 'react'

const colunas = [
    { titulo: 'Prospecção', cor: 'border-info', cartoes: ['Épsilon Saúde 4', 'Zeta Atacado 2'] },
    { titulo: 'Proposta', cor: 'border-warning', cartoes: ['Kappa Indústria 7'] },
    {
        titulo: 'Fechado',
        cor: 'border-success',
        cartoes: ['Alfa Distribuidora 1', 'Gama Indústria 3', 'Sigma Hospitalar 2'],
    },
]

/**
 * Padrão `custom`: a tela não segue um dos padrões prontos, mas continua montada só com componentes e
 * classes da lib. Aqui, um quadro de oportunidades.
 */
export default function Personalizado() {
    const [aberto, setAberto] = useState<string | null>(null)

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Oportunidades"
                description="Exemplo de tela livre."
                actions={
                    <Button className="btn-success btn-circle" aria-label="Nova oportunidade">
                        <Plus size={18} strokeWidth={1.75} />
                    </Button>
                }
            />
            <div className="grid gap-4 md:grid-cols-3">
                {colunas.map((coluna) => (
                    <section key={coluna.titulo} className={`rounded-box border-t-4 bg-base-200 p-3 ${coluna.cor}`}>
                        <h2 className="mb-3 text-sm font-semibold">
                            {coluna.titulo} <span className="badge badge-sm">{coluna.cartoes.length}</span>
                        </h2>
                        <ul className="flex flex-col gap-2">
                            {coluna.cartoes.map((cartao) => (
                                <li key={cartao}>
                                    <button
                                        type="button"
                                        className="card w-full bg-base-100 p-3 text-left shadow-sm hover:shadow"
                                        onClick={() => setAberto(cartao)}
                                    >
                                        <span className="flex items-center justify-between gap-2">
                                            <span className="text-sm">{cartao}</span>
                                            <Tooltip text="Responsável: Ana Souza" className="tooltip-left">
                                                <Avatar className="avatar-placeholder">
                                                    <div className="w-7 rounded-full bg-neutral text-neutral-content">
                                                        <span className="text-xs">AS</span>
                                                    </div>
                                                </Avatar>
                                            </Tooltip>
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>
            <Modal
                isOpen={aberto !== null}
                onClose={() => setAberto(null)}
                headerText={aberto ?? ''}
                className="w-full max-w-md"
            >
                <p className="text-sm">Detalhes da oportunidade (fictícios).</p>
            </Modal>
        </div>
    )
}
