import { render } from '@testing-library/react'
import Loader from '../index'
import { useLoaderStore } from '../loaderStore'

vi.mock('../loaderStore', () => ({
    useLoaderStore: vi.fn(),
}))

const mockUseLoaderStore = vi.mocked(useLoaderStore)

describe('Loader', () => {
    it('deve renderizar o loader visivel quando loading=true', () => {
        mockUseLoaderStore.mockImplementation((selector: any) => selector({ loading: true, requestCount: 1 }))

        render(<Loader />)

        const loaderEl = document.getElementById('loader')
        expect(loaderEl).toBeInTheDocument()
        expect(loaderEl?.style.display).toBe('flex')
    })

    it('deve renderizar o loader oculto quando loading=false', () => {
        mockUseLoaderStore.mockImplementation((selector: any) => selector({ loading: false, requestCount: 0 }))

        render(<Loader />)

        const loaderEl = document.getElementById('loader')
        expect(loaderEl).toBeInTheDocument()
        expect(loaderEl?.style.display).toBe('none')
    })

    it('bloqueia a interação enquanto uma mutação com showLoader está em voo', () => {
        mockUseLoaderStore.mockImplementation((selector: any) => selector({ loading: true, requestCount: 1 }))

        render(<Loader />)

        expect(document.getElementById('loader')?.style.pointerEvents).toBe('auto')
    })

    it('não reage a navigation:start: navegação usa só a barra de progresso', () => {
        mockUseLoaderStore.mockImplementation((selector: any) => selector({ loading: false, requestCount: 0 }))

        render(<Loader />)

        window.dispatchEvent(new CustomEvent('navigation:start', { detail: { href: '/tickets/1' } }))

        const loaderEl = document.getElementById('loader')
        expect(loaderEl?.style.display).toBe('none')
    })
})
