import { fireEvent, renderHook } from '@testing-library/react'
import { useRef } from 'react'
import { useClickOutside } from '../useClickOutside'

describe('useClickOutside', () => {
    function setupTest(enabled = true) {
        const callback = vi.fn()
        const element = document.createElement('div')
        document.body.appendChild(element)

        const { unmount } = renderHook(() => {
            const ref = useRef<HTMLElement>(element)
            useClickOutside(ref, callback, enabled)
            return ref
        })

        return { callback, element, unmount }
    }

    afterEach(() => {
        document.body.innerHTML = ''
    })

    it('deve chamar o callback ao clicar fora do elemento', () => {
        const { callback } = setupTest()

        fireEvent.mouseDown(document.body)

        expect(callback).toHaveBeenCalledTimes(1)
    })

    it('nao deve chamar o callback ao clicar dentro do elemento', () => {
        const { callback, element } = setupTest()

        fireEvent.mouseDown(element)

        expect(callback).not.toHaveBeenCalled()
    })

    it('nao deve chamar o callback ao clicar em um filho do elemento', () => {
        const { callback, element } = setupTest()

        const child = document.createElement('span')
        element.appendChild(child)

        fireEvent.mouseDown(child)

        expect(callback).not.toHaveBeenCalled()
    })

    it('nao deve registrar listener quando enabled e false', () => {
        const { callback } = setupTest(false)

        fireEvent.mouseDown(document.body)

        expect(callback).not.toHaveBeenCalled()
    })

    it('deve remover o listener ao desmontar', () => {
        const { callback, unmount } = setupTest()

        unmount()

        fireEvent.mouseDown(document.body)

        expect(callback).not.toHaveBeenCalled()
    })
})
