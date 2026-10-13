import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import SearchInput from '../index'

describe('SearchInput', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    const campo = () => screen.getByRole('searchbox', { name: 'Pesquisar' })
    const digitar = (texto: string) => fireEvent.change(campo(), { target: { value: texto } })

    it('avisa uma vez com o termo final depois do debounce', async () => {
        const onDebouncedChange = vi.fn()
        render(<SearchInput onDebouncedChange={onDebouncedChange} />)

        digitar('no')
        digitar('not')
        digitar('nota')
        expect(onDebouncedChange).not.toHaveBeenCalled()

        await vi.advanceTimersByTimeAsync(500)

        expect(onDebouncedChange).toHaveBeenCalledTimes(1)
        expect(onDebouncedChange).toHaveBeenCalledWith('nota')
    })

    it('não avisa na montagem', async () => {
        const onDebouncedChange = vi.fn()
        render(<SearchInput onDebouncedChange={onDebouncedChange} defaultValue="abc" />)

        await vi.advanceTimersByTimeAsync(1000)

        expect(onDebouncedChange).not.toHaveBeenCalled()
    })

    it('mantém o texto digitado quando o pai re-renderiza com outra callback', () => {
        const { rerender } = render(<SearchInput onDebouncedChange={vi.fn()} />)
        digitar('abc')

        rerender(<SearchInput onDebouncedChange={vi.fn()} />)

        expect(campo()).toHaveValue('abc')
    })
})
