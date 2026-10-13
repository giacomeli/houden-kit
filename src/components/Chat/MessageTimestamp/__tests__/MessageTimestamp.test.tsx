import { fireEvent, render, screen } from '@testing-library/react'
import MessageTimestamp from '../index'

describe('MessageTimestamp', () => {
    const mockDate = '2026-03-15T14:30:00.000Z'

    it('deve renderizar o horario curto inicialmente', () => {
        render(<MessageTimestamp createdAt={mockDate} />)

        const timeEl = screen.getByRole('time')
        expect(timeEl).toBeInTheDocument()
        // Deve mostrar apenas hora:minuto
        expect(timeEl.textContent).toMatch(/\d{2}:\d{2}/)
    })

    it('deve alternar para data/hora completa ao clicar', () => {
        render(<MessageTimestamp createdAt={mockDate} />)

        const timeEl = screen.getByRole('time')
        const textoInicial = timeEl.textContent

        fireEvent.click(timeEl)

        // Apos clique, deve mostrar data completa (formato diferente do inicial)
        expect(timeEl.textContent).not.toBe(textoInicial)
        // Formato completo inclui barra (dd/mm/yyyy)
        expect(timeEl.textContent).toMatch(/\//)
    })

    it('deve voltar ao horario curto ao clicar novamente', () => {
        render(<MessageTimestamp createdAt={mockDate} />)

        const timeEl = screen.getByRole('time')
        const textoInicial = timeEl.textContent

        // Expandir
        fireEvent.click(timeEl)
        expect(timeEl.textContent).not.toBe(textoInicial)

        // Colapsar
        fireEvent.click(timeEl)
        expect(timeEl.textContent).toBe(textoInicial)
    })

    it('deve ter cursor pointer para indicar interatividade', () => {
        render(<MessageTimestamp createdAt={mockDate} />)

        const timeEl = screen.getByRole('time')
        expect(timeEl.className).toContain('cursor-pointer')
    })
})
