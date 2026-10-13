import { RefObject, useCallback, useEffect } from 'react'

/**
 * Hook customizado para detectar cliques fora de um elemento.
 * Útil para fechar dropdowns, modais ou menus quando o usuário clica fora deles.
 *
 * @param ref - Referência ao elemento que deve ser monitorado
 * @param callback - Função a ser executada quando um clique fora for detectado
 * @param enabled - Opcional: permite desabilitar o listener (útil para performance)
 */
export function useClickOutside(ref: RefObject<HTMLElement | null>, callback: () => void, enabled: boolean = true) {
    const handleClickOutside = useCallback(
        (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                callback()
            }
        },
        [ref, callback],
    )

    useEffect(() => {
        if (!enabled) return

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [handleClickOutside, enabled])
}
