import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Chart from '../index'

// Chart.js é carregado por import() dinâmico; aqui um stub registra instâncias e chamadas.
const chartState = vi.hoisted(() => ({
    instances: [] as Array<{
        config: { type: string; data: unknown }
        update: ReturnType<typeof vi.fn>
        destroy: ReturnType<typeof vi.fn>
        data: unknown
    }>,
}))

vi.mock('chart.js/auto', () => ({
    default: class {
        config: { type: string; data: unknown }
        data: unknown
        update = vi.fn()
        destroy = vi.fn()
        constructor(_canvas: HTMLCanvasElement, config: { type: string; data: unknown }) {
            this.config = config
            this.data = config.data
            chartState.instances.push(this)
        }
    },
}))

describe('Chart', () => {
    beforeEach(() => {
        chartState.instances.length = 0
    })

    it('atualiza a instância existente quando os dados mudam, em vez de destruir e recriar', async () => {
        const first = { labels: ['a'], datasets: [{ data: [1] }] }
        const second = { labels: ['a', 'b'], datasets: [{ data: [1, 2] }] }

        const { rerender, unmount } = render(<Chart type="bar" data={first} />)
        await waitFor(() => expect(chartState.instances).toHaveLength(1))

        rerender(<Chart type="bar" data={second} />)

        await waitFor(() => expect(chartState.instances[0].update).toHaveBeenCalledTimes(1))
        expect(chartState.instances).toHaveLength(1)
        expect(chartState.instances[0].data).toBe(second)
        expect(chartState.instances[0].destroy).not.toHaveBeenCalled()

        unmount()
        expect(chartState.instances[0].destroy).toHaveBeenCalledTimes(1)
    })

    it('recria a instância quando o tipo do gráfico muda', async () => {
        const data = { labels: ['a'], datasets: [{ data: [1] }] }

        const { rerender } = render(<Chart type="bar" data={data} />)
        await waitFor(() => expect(chartState.instances).toHaveLength(1))

        rerender(<Chart type="line" data={data} />)

        await waitFor(() => expect(chartState.instances).toHaveLength(2))
        expect(chartState.instances[0].destroy).toHaveBeenCalledTimes(1)
        expect(chartState.instances[1].config.type).toBe('line')
    })
})
