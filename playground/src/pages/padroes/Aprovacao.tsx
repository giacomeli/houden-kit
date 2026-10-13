import { Button, ConfirmDialog, MessageTimestamp, PageHeader, toastError, toastSuccess } from 'houden-kit'
import { Check, X } from 'houden-kit/icons'
import { useState } from 'react'
import { moeda } from '../../data/clientes'
import { type Solicitacao, solicitacoesIniciais } from '../../data/solicitacoes'

type Acao = { tipo: 'aprovar' | 'recusar'; solicitacao: Solicitacao } | null

const badge: Record<Solicitacao['situacao'], string> = {
    Pendente: 'badge-warning',
    Aprovada: 'badge-success',
    Recusada: 'badge-error',
}

/** Padrão `approval`: aprovar com confirmação e recusar com motivo obrigatório. */
export default function Aprovacao() {
    const [solicitacoes, setSolicitacoes] = useState(solicitacoesIniciais)
    const [acao, setAcao] = useState<Acao>(null)
    const [enviando, setEnviando] = useState(false)

    const decidir = (motivo?: string) => {
        if (!acao) return
        setEnviando(true)
        // Simula a chamada ao backend.
        window.setTimeout(() => {
            setSolicitacoes((lista) =>
                lista.map((s) =>
                    s.id === acao.solicitacao.id
                        ? { ...s, situacao: acao.tipo === 'aprovar' ? 'Aprovada' : 'Recusada', motivo }
                        : s,
                ),
            )
            if (acao.tipo === 'aprovar') toastSuccess(`Solicitação ${acao.solicitacao.id} aprovada.`, 3000)
            else toastError(`Solicitação ${acao.solicitacao.id} recusada.`, 3000)
            setEnviando(false)
            setAcao(null)
        }, 600)
    }

    return (
        <div className="flex flex-col gap-4">
            <PageHeader title="Aprovações" description="Solicitações comerciais aguardando decisão." />
            <ul className="flex flex-col gap-3">
                {solicitacoes.map((s) => (
                    <li key={s.id} className="card bg-base-200">
                        <div className="card-body flex-row flex-wrap items-center gap-4 p-4">
                            <div className="min-w-0 flex-1">
                                <p className="font-semibold">{s.titulo}</p>
                                <p className="text-xs opacity-70">
                                    {s.solicitante} · {moeda(s.valor)} · <MessageTimestamp createdAt={s.criadaEm} />
                                </p>
                                {s.motivo && <p className="mt-1 text-xs">Motivo: {s.motivo}</p>}
                            </div>
                            <span className={`badge ${badge[s.situacao]}`}>{s.situacao}</span>
                            {s.situacao === 'Pendente' && (
                                <div className="flex gap-2">
                                    <Button
                                        className="btn-sm btn-error btn-outline"
                                        onClick={() => setAcao({ tipo: 'recusar', solicitacao: s })}
                                    >
                                        <X size={16} strokeWidth={1.75} />
                                        Recusar
                                    </Button>
                                    <Button
                                        className="btn-sm btn-success"
                                        onClick={() => setAcao({ tipo: 'aprovar', solicitacao: s })}
                                    >
                                        <Check size={16} strokeWidth={1.75} />
                                        Aprovar
                                    </Button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            <ConfirmDialog
                open={acao?.tipo === 'aprovar'}
                title="Aprovar solicitação"
                description={acao?.solicitacao.titulo}
                confirmLabel="Aprovar"
                isLoading={enviando}
                onCancel={() => setAcao(null)}
                onConfirm={() => decidir()}
            />
            <ConfirmDialog
                open={acao?.tipo === 'recusar'}
                title="Recusar solicitação"
                description={acao?.solicitacao.titulo}
                confirmLabel="Recusar"
                tone="error"
                reason={{ label: 'Motivo da recusa', required: true, placeholder: 'Explique ao solicitante' }}
                isLoading={enviando}
                onCancel={() => setAcao(null)}
                onConfirm={decidir}
            />
        </div>
    )
}
