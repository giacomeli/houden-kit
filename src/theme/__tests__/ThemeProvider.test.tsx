import { act, render, renderHook, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { ThemeProvider } from '../ThemeProvider'
import { applyStoredTheme, THEME_DARK, THEME_LIGHT, THEME_STORAGE_KEY } from '../themes'
import { useTheme } from '../useTheme'

function mockSystem(dark: boolean) {
    const listeners = new Set<(event: MediaQueryListEvent) => void>()
    const media = {
        matches: dark,
        addEventListener: (_: string, l: (event: MediaQueryListEvent) => void) => listeners.add(l),
        removeEventListener: (_: string, l: (event: MediaQueryListEvent) => void) => listeners.delete(l),
    }
    window.matchMedia = vi.fn(() => media) as unknown as typeof window.matchMedia
    return {
        change(next: boolean) {
            media.matches = next
            for (const l of listeners) l({ matches: next } as MediaQueryListEvent)
        },
    }
}

const wrapper = ({ children }: { children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>
const htmlTheme = () => document.documentElement.getAttribute('data-theme')

describe('ThemeProvider', () => {
    beforeEach(() => {
        localStorage.clear()
        document.documentElement.removeAttribute('data-theme')
    })

    it('sem escolha salva, segue o tema do sistema', () => {
        mockSystem(true)
        const { result } = renderHook(() => useTheme(), { wrapper })
        expect(result.current.theme).toBe(THEME_DARK)
        expect(htmlTheme()).toBe(THEME_DARK)
    })

    it('a escolha salva vence a do sistema', () => {
        mockSystem(true)
        localStorage.setItem(THEME_STORAGE_KEY, THEME_LIGHT)
        const { result } = renderHook(() => useTheme(), { wrapper })
        expect(result.current.theme).toBe(THEME_LIGHT)
    })

    it('alterna, grava e aplica no <html>', () => {
        mockSystem(false)
        const { result } = renderHook(() => useTheme(), { wrapper })
        act(() => result.current.toggleTheme())
        expect(result.current.theme).toBe(THEME_DARK)
        expect(result.current.isDark).toBe(true)
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(THEME_DARK)
        expect(htmlTheme()).toBe(THEME_DARK)
    })

    it('acompanha a mudança do sistema enquanto não há escolha salva', () => {
        const system = mockSystem(false)
        const { result } = renderHook(() => useTheme(), { wrapper })
        act(() => system.change(true))
        expect(result.current.theme).toBe(THEME_DARK)
    })

    it('continua funcionando com o localStorage indisponível', () => {
        mockSystem(false)
        const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
            throw new Error('bloqueado')
        })
        const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
            throw new Error('bloqueado')
        })
        const original = { getItem: localStorage.getItem, setItem: localStorage.setItem }
        localStorage.getItem = getItem as unknown as Storage['getItem']
        localStorage.setItem = setItem as unknown as Storage['setItem']
        try {
            const { result } = renderHook(() => useTheme(), { wrapper })
            act(() => result.current.setTheme(THEME_DARK))
            expect(result.current.theme).toBe(THEME_DARK)
        } finally {
            localStorage.getItem = original.getItem
            localStorage.setItem = original.setItem
            getItem.mockRestore()
            setItem.mockRestore()
        }
    })

    it('applyStoredTheme aplica o tema antes do render', () => {
        mockSystem(false)
        localStorage.setItem(THEME_STORAGE_KEY, THEME_DARK)
        expect(applyStoredTheme()).toBe(THEME_DARK)
        expect(htmlTheme()).toBe(THEME_DARK)
    })

    it('useTheme fora do provider falha com mensagem clara', () => {
        const silenciar = vi.spyOn(console, 'error').mockImplementation(() => {})
        expect(() => renderHook(() => useTheme())).toThrow(/ThemeProvider/)
        silenciar.mockRestore()
    })

    it('renderiza os filhos', () => {
        mockSystem(false)
        render(<ThemeProvider>conteúdo</ThemeProvider>)
        expect(screen.getByText('conteúdo')).toBeInTheDocument()
    })
})
