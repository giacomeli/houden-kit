import type { ReactNode } from 'react'
import { type FieldValues, type UseFormReturn, useForm } from 'react-hook-form'

/**
 * Fornece `control`, `register` e `setValue` do react-hook-form aos casos. Roda dos dois lados da
 * paridade com o react-hook-form da instalação de cada lado (mesma versão 7.x).
 */
export function FormHarness({
    defaultValues,
    children,
}: {
    defaultValues?: FieldValues
    children: (form: UseFormReturn<FieldValues>) => ReactNode
}) {
    const form = useForm({ defaultValues })
    return <form>{children(form)}</form>
}
