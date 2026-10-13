import type { ParityCases } from '../types'

const cases: ParityCases = {
    'Form/Button': [
        { name: 'padrao', render: ({ default: Button }) => <Button>Salvar</Button> },
        {
            name: 'com-classe',
            render: ({ default: Button }) => <Button className="btn-primary btn-sm">Enviar</Button>,
        },
        { name: 'desabilitado', render: ({ default: Button }) => <Button disabled>Salvar</Button> },
        { name: 'carregando', render: ({ default: Button }) => <Button isLoading>Salvar</Button> },
        {
            name: 'submit',
            render: ({ default: Button }) => (
                <Button type="submit" aria-label="Enviar formulário">
                    Enviar
                </Button>
            ),
        },
    ],
}

export default cases
