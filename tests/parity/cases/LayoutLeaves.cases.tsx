import type { ParityCases } from '../types'

const cases: ParityCases = {
    'Layout/Tooltip': [
        {
            name: 'padrao',
            render: ({ default: Tooltip }) => (
                <Tooltip text="Mais informações">
                    <span>alvo</span>
                </Tooltip>
            ),
        },
        {
            name: 'com-classe',
            render: ({ default: Tooltip }) => (
                <Tooltip text="Abaixo" className="tooltip-bottom">
                    <button type="button">alvo</button>
                </Tooltip>
            ),
        },
    ],
    'Layout/Alert': [
        {
            name: 'aviso',
            render: ({ default: Alert }) => (
                <Alert message="Nenhum registro encontrado" icon={<span>i</span>} className="alert-warning" />
            ),
        },
        {
            name: 'erro',
            render: ({ default: Alert }) => (
                <Alert message="Falha ao carregar" icon={null} className="alert-error mt-4" />
            ),
        },
    ],
}

export default cases
