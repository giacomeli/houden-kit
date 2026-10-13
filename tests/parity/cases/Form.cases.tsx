import { FormHarness } from '../harness'
import type { ParityCases } from '../types'

const opcoes = [
    { id: 1, name: 'Produto A', value: '1' },
    { id: 2, name: 'Produto B', value: '2' },
    { id: 3, name: 'Produto C', value: '3' },
]
const opcoesMulti = [
    { name: 'Vendas', code: 'vendas' },
    { name: 'SAC', code: 'sac' },
    { name: 'Financeiro', code: 'financeiro' },
]
const noop = () => {}

const cases: ParityCases = {
    'Form/Checkbox': [
        { name: 'padrao', render: ({ default: Checkbox }) => <Checkbox /> },
        { name: 'toggle', render: ({ default: Checkbox }) => <Checkbox toggle defaultChecked /> },
        { name: 'com-classe', render: ({ default: Checkbox }) => <Checkbox className="checkbox-sm" disabled /> },
    ],
    'Form/FormError': [
        { name: 'padrao', render: ({ default: FormError }) => <FormError>Campo obrigatório</FormError> },
    ],
    'Form/Label': [
        { name: 'padrao', render: ({ default: Label }) => <Label labelText="Nome" /> },
        { name: 'com-erro', render: ({ default: Label }) => <Label labelText="Nome" hasError /> },
        { name: 'com-tooltip', render: ({ default: Label }) => <Label labelText="Nome" tooltipText="Nome completo" /> },
        {
            name: 'com-conteudo',
            render: ({ default: Label }) => (
                <Label labelText="E-mail" tooltipContent={<strong>Use o e-mail corporativo</strong>}>
                    <input />
                </Label>
            ),
        },
    ],
    'Form/Input': [
        { name: 'padrao', render: ({ default: Input }) => <Input labelText="Nome" placeholder="Digite o nome" /> },
        {
            name: 'obrigatorio-com-erro',
            render: ({ default: Input }) => <Input labelText="Nome" isRequired hasError error="Campo obrigatório" />,
        },
        { name: 'senha', render: ({ default: Input }) => <Input labelText="Senha" isPassword /> },
        {
            name: 'senha-visivel',
            render: ({ default: Input }) => <Input labelText="Senha" isPassword />,
            interact: async ({ user, screen }) => {
                await user.click(screen.getByRole('button'))
            },
        },
        { name: 'desabilitado', render: ({ default: Input }) => <Input labelText="Código" isDisabled value="123" /> },
        {
            name: 'com-hint-e-tooltip',
            render: ({ default: Input }) => (
                <Input labelText="CNPJ" hint="Somente números" tooltipText="Cadastro da empresa" inputClass="w-48" />
            ),
        },
    ],
    'Form/Select': [
        { name: 'padrao', render: ({ default: Select }) => <Select labelText="Produto" options={opcoes} /> },
        {
            name: 'obrigatorio-com-erro',
            render: ({ default: Select }) => (
                <Select labelText="Produto" options={opcoes} isRequired hasError error="Selecione um produto" />
            ),
        },
        {
            name: 'desabilitado-com-hint',
            render: ({ default: Select }) => (
                <Select
                    labelText="Produto"
                    options={opcoes}
                    isDisabled
                    hint="Definido pelo contrato"
                    defaultValue="2"
                />
            ),
        },
    ],
    'Form/TextArea': [
        { name: 'padrao', render: ({ default: TextArea }) => <TextArea placeholder="Observações" /> },
        { name: 'com-erro', render: ({ default: TextArea }) => <TextArea hasError className="h-32" /> },
    ],
    'Form/SearchInput': [
        {
            name: 'padrao',
            render: ({ default: SearchInput }) => (
                <SearchInput onDebouncedChange={noop} placeholder="Buscar cliente" ariaLabel="Buscar cliente" />
            ),
        },
        {
            name: 'com-valor',
            render: ({ default: SearchInput }) => (
                <SearchInput onDebouncedChange={noop} defaultValue="Houden" className="w-64" />
            ),
        },
    ],
    'Form/DatePicker': [
        {
            name: 'padrao',
            render: ({ default: DatePicker }) => (
                <FormHarness>{({ control }) => <DatePicker name="data" control={control} />}</FormHarness>
            ),
        },
        {
            name: 'com-hora-e-valor',
            render: ({ default: DatePicker }) => (
                <FormHarness defaultValues={{ data: '2026-10-13T14:30' }}>
                    {({ control }) => <DatePicker name="data" control={control} hasTimePicker />}
                </FormHarness>
            ),
        },
        {
            name: 'com-erro',
            render: ({ default: DatePicker }) => (
                <FormHarness defaultValues={{ data: '2026-10-13' }}>
                    {({ control }) => <DatePicker name="data" control={control} hasError className="w-40" />}
                </FormHarness>
            ),
        },
    ],
    'Form/MaskedInput': [
        {
            name: 'padrao',
            render: ({ default: MaskedInput }) => (
                <FormHarness>
                    {({ control }) => <MaskedInput name="cpf" control={control} mask="999.999.999-99" />}
                </FormHarness>
            ),
        },
        {
            name: 'desabilitado-com-classe',
            render: ({ default: MaskedInput }) => (
                <FormHarness defaultValues={{ telefone: '(11) 91234-5678' }}>
                    {({ control }) => (
                        <MaskedInput
                            name="telefone"
                            control={control}
                            mask="(99) 99999-9999"
                            isDisabled
                            className="w-40"
                        />
                    )}
                </FormHarness>
            ),
        },
    ],
    'Form/InputCurrency': [
        {
            name: 'padrao',
            render: ({ default: InputCurrency }) => (
                <FormHarness>{({ control }) => <InputCurrency name="valor" control={control} />}</FormHarness>
            ),
        },
        {
            name: 'com-valor-e-erro',
            render: ({ default: InputCurrency }) => (
                <FormHarness defaultValues={{ valor: 1234.5 }}>
                    {({ control }) => <InputCurrency name="valor" control={control} hasError className="w-40" />}
                </FormHarness>
            ),
        },
    ],
    'Form/InputChips': [
        {
            name: 'vazio',
            render: ({ default: InputChips }) => (
                <FormHarness defaultValues={{ tags: [] }}>
                    {({ control }) => <InputChips name="tags" control={control} />}
                </FormHarness>
            ),
        },
        {
            name: 'com-chips',
            render: ({ default: InputChips }) => (
                <FormHarness defaultValues={{ tags: ['urgente', 'cliente-vip'] }}>
                    {({ control }) => <InputChips name="tags" control={control} hasError className="w-80" />}
                </FormHarness>
            ),
        },
    ],
    'Form/InputFile': [
        {
            name: 'vazio',
            render: ({ default: InputFile }) => <InputFile maxFiles={3} setFiles={noop} files={[]} />,
        },
        {
            name: 'com-arquivos',
            render: ({ default: InputFile }) => (
                <InputFile
                    maxFiles={3}
                    setFiles={noop}
                    files={[new File(['a'], 'contrato.pdf'), new File(['b'], 'foto.png')]}
                />
            ),
        },
    ],
    'Form/MultiSelect': [
        {
            name: 'padrao',
            render: ({ default: MultiSelect }) => (
                <FormHarness>
                    {({ control }) => <MultiSelect name="areas" control={control} options={opcoesMulti} />}
                </FormHarness>
            ),
        },
        {
            name: 'aberto-com-selecao',
            render: ({ default: MultiSelect }) => (
                <FormHarness defaultValues={{ areas: [opcoesMulti[0]] }}>
                    {({ control }) => (
                        <MultiSelect name="areas" control={control} options={opcoesMulti} placeholder="Áreas" />
                    )}
                </FormHarness>
            ),
            interact: async ({ user, screen }) => {
                await user.click(screen.getByText('Vendas'))
            },
        },
    ],
    'Form/SearchSelect': [
        {
            name: 'padrao',
            render: ({ default: SearchSelect }) => (
                <FormHarness>
                    {({ setValue }) => (
                        <SearchSelect options={opcoes} setValue={setValue} name="produto" label="Produto" />
                    )}
                </FormHarness>
            ),
        },
        {
            name: 'obrigatorio-com-erro',
            render: ({ default: SearchSelect }) => (
                <FormHarness>
                    {({ setValue }) => (
                        <SearchSelect
                            options={opcoes}
                            setValue={setValue}
                            name="produto"
                            label="Produto"
                            isRequired
                            error="Selecione um produto"
                        />
                    )}
                </FormHarness>
            ),
        },
        {
            name: 'aberto-com-valor',
            render: ({ default: SearchSelect }) => (
                <FormHarness>
                    {({ setValue }) => (
                        <SearchSelect options={opcoes} setValue={setValue} name="produto" label="Produto" value="2" />
                    )}
                </FormHarness>
            ),
            interact: async ({ user, screen }) => {
                await user.click(screen.getByRole('textbox'))
            },
        },
    ],
    'Form/MultiSearchSelect': [
        {
            name: 'padrao',
            render: ({ default: MultiSearchSelect }) => (
                <FormHarness>
                    {({ setValue }) => (
                        <MultiSearchSelect options={opcoes} setValue={setValue} name="produtos" label="Produtos" />
                    )}
                </FormHarness>
            ),
        },
        {
            name: 'aberto-com-selecao',
            render: ({ default: MultiSearchSelect }) => (
                <FormHarness defaultValues={{ produtos: ['1', '3'] }}>
                    {({ setValue, watch }) => (
                        <MultiSearchSelect
                            options={opcoes}
                            setValue={setValue}
                            watch={watch}
                            name="produtos"
                            label="Produtos"
                            isRequired
                            error="Selecione ao menos um"
                        />
                    )}
                </FormHarness>
            ),
            interact: async ({ user, screen }) => {
                await user.click(screen.getByRole('textbox'))
            },
        },
    ],
    'Form/DatePickerFormGroup': [
        {
            name: 'padrao',
            render: ({ default: DatePickerFormGroup }) => (
                <FormHarness>
                    {({ control }) => (
                        <DatePickerFormGroup labelText="Vencimento" name="vencimento" control={control} />
                    )}
                </FormHarness>
            ),
        },
        {
            name: 'obrigatorio-com-erro',
            render: ({ default: DatePickerFormGroup }) => (
                <FormHarness>
                    {({ control }) => (
                        <DatePickerFormGroup
                            labelText="Vencimento"
                            name="vencimento"
                            control={control}
                            isRequired
                            error="Informe a data"
                            tooltipText="Data do primeiro boleto"
                            className="w-full"
                            inputClass="w-40"
                        />
                    )}
                </FormHarness>
            ),
        },
    ],
    'Form/DatePickerGroup': [
        {
            name: 'padrao',
            render: ({ default: DatePickerGroup }) => (
                <FormHarness>
                    {({ control }) => (
                        <DatePickerGroup
                            control={control}
                            label="Período"
                            firstInputLabel="De"
                            secondInputLabel="Até"
                            firstInputName="inicio"
                            secondInputName="fim"
                        />
                    )}
                </FormHarness>
            ),
        },
    ],
    'Form/InputCurrencyFormGroup': [
        {
            name: 'padrao',
            render: ({ default: InputCurrencyFormGroup }) => (
                <FormHarness>
                    {({ control }) => <InputCurrencyFormGroup labelText="Valor" name="valor" control={control} />}
                </FormHarness>
            ),
        },
        {
            name: 'obrigatorio-com-erro',
            render: ({ default: InputCurrencyFormGroup }) => (
                <FormHarness defaultValues={{ valor: 99.9 }}>
                    {({ control }) => (
                        <InputCurrencyFormGroup
                            labelText="Valor"
                            name="valor"
                            control={control}
                            isRequired
                            error="Valor inválido"
                            tooltipContent={<em>Com impostos</em>}
                        />
                    )}
                </FormHarness>
            ),
        },
    ],
    'Form/MultiSelectFormGroup': [
        {
            name: 'padrao',
            render: ({ default: MultiSelectFormGroup }) => (
                <FormHarness>
                    {({ control }) => (
                        <MultiSelectFormGroup labelText="Áreas" name="areas" control={control} options={opcoesMulti} />
                    )}
                </FormHarness>
            ),
        },
        {
            name: 'obrigatorio-com-erro',
            render: ({ default: MultiSelectFormGroup }) => (
                <FormHarness>
                    {({ control }) => (
                        <MultiSelectFormGroup
                            labelText="Áreas"
                            name="areas"
                            control={control}
                            options={opcoesMulti}
                            isRequired
                            error="Selecione uma área"
                        />
                    )}
                </FormHarness>
            ),
        },
    ],
    'Form/TextAreaFormGroup': [
        { name: 'padrao', render: ({ default: TextAreaFormGroup }) => <TextAreaFormGroup labelText="Observações" /> },
        {
            name: 'obrigatorio-com-erro',
            render: ({ default: TextAreaFormGroup }) => (
                <TextAreaFormGroup
                    labelText="Motivo"
                    isRequired
                    error="Informe o motivo"
                    tooltipText="Visível para o cliente"
                    readonly
                />
            ),
        },
    ],
}

export default cases
