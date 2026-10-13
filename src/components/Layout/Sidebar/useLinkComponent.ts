'use client'

import { useContext } from 'react'
import type { LinkComponent } from '../../../types/navigation'
import { SidebarContext } from './SidebarProvider'

/**
 * Componente de link do app, vindo do contexto da Sidebar. Fora do provider (itens renderizados
 * sozinhos, como nos testes), cai no `'a'` em vez de lançar erro.
 */
export function useLinkComponent(): LinkComponent {
    return useContext(SidebarContext)?.linkComponent ?? 'a'
}
