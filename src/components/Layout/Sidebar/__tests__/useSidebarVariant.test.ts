import { renderHook, waitFor } from '@testing-library/react'
import { CHAVE_VARIANTE, type SidebarVariant, useSidebarVariant } from '../useSidebarVariant'

const irPara = (url: string) => window.history.replaceState({}, '', url)

describe('useSidebarVariant', () => {
    beforeEach(() => {
        localStorage.clear()
        irPara('/')
        vi.unstubAllEnvs()
    })

    it('sem env e sem preferência, usa a variante legada', async () => {
        const { result } = renderHook(() => useSidebarVariant())

        await waitFor(() => expect(result.current).toBe('legacy'))
    })

    // No app de origem, o padrão vinha da env `NEXT_PUBLIC_SIDEBAR_VARIANT`; na lib, do `defaultVariant`.
    it('o defaultVariant define o padrão do ambiente', async () => {
        const { result } = renderHook(() => useSidebarVariant('rail'))

        await waitFor(() => expect(result.current).toBe('rail'))
    })

    /**
     * A camada de URL existe porque o padrão é fixado no build: sem ela, mostrar a variante nova a
     * alguém exigiria um deploy, e comparar as duas exigiria dois.
     */
    it('o parâmetro de URL sobrepõe o padrão e grava a preferência', async () => {
        irPara('/vendas/conversas?sidebar=rail')

        const { result } = renderHook(() => useSidebarVariant('legacy'))

        await waitFor(() => expect(result.current).toBe('rail'))
        expect(localStorage.getItem(CHAVE_VARIANTE)).toBe('rail')
    })

    it('a preferência gravada sobrevive a uma navegação sem o parâmetro', async () => {
        localStorage.setItem(CHAVE_VARIANTE, 'rail')
        irPara('/dashboard')

        const { result } = renderHook(() => useSidebarVariant())

        await waitFor(() => expect(result.current).toBe('rail'))
    })

    it('o parâmetro permite voltar para a variante legada', async () => {
        localStorage.setItem(CHAVE_VARIANTE, 'rail')
        irPara('/dashboard?sidebar=legacy')

        const { result } = renderHook(() => useSidebarVariant())

        await waitFor(() => expect(result.current).toBe('legacy'))
        expect(localStorage.getItem(CHAVE_VARIANTE)).toBe('legacy')
    })

    it('valor inválido no parâmetro é ignorado, sem quebrar', async () => {
        irPara('/dashboard?sidebar=inexistente')

        const { result } = renderHook(() => useSidebarVariant())

        await waitFor(() => expect(result.current).toBe('legacy'))
        expect(localStorage.getItem(CHAVE_VARIANTE)).toBeNull()
    })

    it('valor inválido no padrão é ignorado', async () => {
        const { result } = renderHook(() => useSidebarVariant('trilho-turbo' as SidebarVariant))

        await waitFor(() => expect(result.current).toBe('legacy'))
    })

    /**
     * Navegação privada e armazenamento bloqueado fazem `localStorage` lançar no acesso. A flag é
     * conveniência de comparação: não pode derrubar a navegação inteira do sistema.
     */
    it('degrada para o padrão quando o armazenamento lança', async () => {
        const original = Object.getOwnPropertyDescriptor(window, 'localStorage')
        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            get() {
                throw new Error('armazenamento bloqueado')
            },
        })

        const { result } = renderHook(() => useSidebarVariant())

        await waitFor(() => expect(result.current).toBe('legacy'))

        if (original) Object.defineProperty(window, 'localStorage', original)
    })
})
