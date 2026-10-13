// O tipo do app de origem continua atribuível ao da lib. Cópia literal do `z.infer` dos schemas de
// `src/schemas/sales/commonSchemas.ts` (Zod 4, `.passthrough()` gera o índice `[x: string]: unknown`).
import type { IMultiSelectOptions, IOption } from '../../src/types/option'

type SourceOption = {
    [x: string]: unknown
    name: string
    value?: string | number | null | undefined
    id?: string | number | null | undefined
}
type SourceMultiSelectOptions = { name: string; code: string | number }

describe('tipos de opção', () => {
    it('IOption do app de origem é atribuível ao da lib, e vice-versa', () => {
        expectTypeOf<SourceOption>().toExtend<IOption>()
        expectTypeOf<IOption>().toExtend<SourceOption>()
    })

    it('IMultiSelectOptions do app de origem é atribuível ao da lib', () => {
        expectTypeOf<SourceMultiSelectOptions>().toExtend<IMultiSelectOptions>()
    })

    it('opção com campos extras continua aceita', () => {
        expectTypeOf<{ name: string; value: number; sigla: string }>().toExtend<IOption>()
    })
})
