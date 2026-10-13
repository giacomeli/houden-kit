'use client'

import { useContext } from 'react'
import { SidebarContext, type SidebarContextValue } from './SidebarProvider'

/**
 * Acesso à camada compartilhada da barra. O guard existe para o erro aparecer aqui, com nome do
 * provider que falta, em vez de estourar linhas depois dentro da variante como leitura de
 * propriedade de `undefined`.
 */
export function useSidebarContext(): SidebarContextValue {
    const contexto = useContext(SidebarContext)

    if (!contexto) {
        throw new Error('useSidebarContext precisa ser usado dentro de um SidebarProvider.')
    }

    return contexto
}
