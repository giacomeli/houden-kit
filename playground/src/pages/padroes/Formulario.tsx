import {
    Button,
    DatePickerFormGroup,
    DatePickerGroup,
    Input,
    InputChips,
    InputCurrencyFormGroup,
    InputFile,
    Label,
    MaskedInput,
    MultiSearchSelect,
    MultiSelectFormGroup,
    PageHeader,
    SearchSelect,
    Select,
    TextAreaFormGroup,
    toastError,
    toastSuccess,
} from 'houden-kit'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { clientes } from '../../data/clientes'

const opcoesCliente = clientes.slice(0, 30).map((c) => ({ id: c.id, name: c.nome, value: String(c.id) }))
const opcoesProduto = ['Luva nitrílica', 'Luva de látex', 'Avental descartável', 'Máscara PFF2', 'Touca'].map(
    (name, i) => ({ id: i + 1, name, value: String(i + 1) }),
)
const condicoes = [
    { name: 'Selecione...', value: '' },
    { name: 'À vista', value: 'avista' },
    { name: '30 dias', value: '30' },
    { name: '30/60/90', value: '30-60-90' },
]
const areas = [
    { name: 'Vendas', code: 'vendas' },
    { name: 'SAC', code: 'sac' },
    { name: 'Financeiro', code: 'financeiro' },
]

interface Pedido {
    cliente: string
    produtos: string[]
    condicao: string
    contato: string
    telefone: string
    valor: number
    entrega: string
    vigenciaInicio: string
    vigenciaFim: string
    areas: { name: string; code: string }[]
    etiquetas: string[]
    observacoes: string
}

/** Padrão `form`: campos da lib com react-hook-form, validação e mensagem de erro. */
export default function Formulario() {
    const [arquivos, setArquivos] = useState<File[]>([])
    const {
        register,
        control,
        setValue,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm<Pedido>({ defaultValues: { produtos: [], etiquetas: [], areas: [] } })

    register('cliente', { required: 'Selecione o cliente' })

    return (
        <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit(
                () => toastSuccess('Pedido salvo (fictício).', 3000),
                () => toastError('Revise os campos destacados.', 3000),
            )}
        >
            <PageHeader title="Novo pedido" description="Todos os campos com * são obrigatórios." />

            <div className="grid gap-4 md:grid-cols-2">
                <SearchSelect
                    options={opcoesCliente}
                    setValue={setValue}
                    name="cliente"
                    label="Cliente"
                    isRequired
                    error={errors.cliente?.message}
                />
                <MultiSearchSelect
                    options={opcoesProduto}
                    setValue={setValue}
                    watch={watch}
                    name="produtos"
                    label="Produtos"
                />
                <Select
                    labelText="Condição de pagamento"
                    options={condicoes}
                    isRequired
                    register={register('condicao', { required: 'Escolha a condição' })}
                    error={errors.condicao?.message}
                    hasError={!!errors.condicao}
                />
                <Input
                    labelText="Contato"
                    placeholder="Nome de quem recebe"
                    isRequired
                    register={register('contato', { required: 'Informe o contato' })}
                    error={errors.contato?.message}
                    hasError={!!errors.contato}
                    tooltipText="Quem assina o recebimento"
                    tooltipContent="?"
                />
                <Label labelText="Telefone">
                    <MaskedInput name="telefone" control={control} mask="(99) 99999-9999" />
                </Label>
                <InputCurrencyFormGroup labelText="Valor estimado" name="valor" control={control} />
                <DatePickerFormGroup labelText="Entrega" name="entrega" control={control} />
                <DatePickerGroup
                    control={control}
                    label="Vigência do preço"
                    firstInputLabel="De"
                    secondInputLabel="Até"
                    firstInputName="vigenciaInicio"
                    secondInputName="vigenciaFim"
                />
                <MultiSelectFormGroup labelText="Áreas avisadas" name="areas" control={control} options={areas} />
                <Label labelText="Etiquetas">
                    <InputChips name="etiquetas" control={control} />
                </Label>
            </div>

            <TextAreaFormGroup labelText="Observações" register={register('observacoes')} />
            <InputFile maxFiles={3} setFiles={setArquivos} files={arquivos} />

            <div className="flex justify-end gap-2">
                <Button type="reset" className="btn-ghost">
                    Limpar
                </Button>
                <Button type="submit">Salvar pedido</Button>
            </div>
        </form>
    )
}
