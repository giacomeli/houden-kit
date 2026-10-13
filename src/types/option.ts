/**
 * Opção de select. Equivalente ao `z.infer<typeof OptionSchema>` de
 * `src/schemas/sales/commonSchemas.ts` do app de origem, sem depender do Zod. O `.passthrough()` do
 * schema vira o índice `[key: string]: unknown`.
 *
 * No app de origem, o tipo é global (`src/types/global.d.ts`); aqui é exportado.
 */
export type IOption = {
    name: string
    value?: string | number | null
    id?: string | number | null
    [key: string]: unknown
}

/** Equivalente ao `z.infer<typeof MultiSelectOptionsSchema>` do app de origem. */
export type IMultiSelectOptions = {
    name: string
    code: string | number
}
