'use client'

import { useEffect, useRef } from 'react'

interface ChartProps {
    type: 'bar' | 'line' | 'pie' | 'doughnut'
    data: any
    className?: string
}

/**
 * Componente Chart usando Chart.js diretamente (sem PrimeReact wrapper).
 * Importa Chart.js dinamicamente para não bloquear o bundle.
 */
export default function Chart({ type, data, className }: ChartProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const chartRef = useRef<any>(null)
    // Dados mais recentes para a criação assíncrona (o import pode resolver depois de `data` mudar).
    const dataRef = useRef(data)
    dataRef.current = data

    // Cria a instância por tipo de gráfico; recriar por mudança de dados apagava e redesenhava o
    // canvas a cada filtro do dashboard.
    useEffect(() => {
        if (!canvasRef.current) return

        let mounted = true

        import('chart.js/auto').then(({ default: ChartJS }) => {
            if (!mounted || !canvasRef.current) return

            if (chartRef.current) {
                chartRef.current.destroy()
            }

            chartRef.current = new ChartJS(canvasRef.current, {
                type,
                data: dataRef.current,
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                },
            })
        })

        return () => {
            mounted = false
            if (chartRef.current) {
                chartRef.current.destroy()
                chartRef.current = null
            }
        }
    }, [type])

    // Dados novos atualizam a instância existente (animação de transição do Chart.js).
    useEffect(() => {
        const chart = chartRef.current
        if (!chart) return
        chart.data = data
        chart.update()
    }, [data])

    return <canvas ref={canvasRef} className={className} />
}
