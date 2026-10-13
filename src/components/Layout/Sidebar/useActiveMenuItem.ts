'use client'

import { useMemo } from 'react'
import type { IMenuItem, IMenuSection } from '../../../types/menu'
import { useSidebarContext } from './useSidebarContext'

export interface ItemAtivo {
    /** Id do item de menu correspondente à rota atual, ou null. */
    itemAtivoId: string | null
    /** Id da seção que contém esse item, usada para marcar a área no trilho. */
    areaAtivaId: string | null
}

/** Link externo nunca é a rota atual, e um `startsWith` cego o marcaria como ativo. */
const ehInterno = (href: string): boolean => href.startsWith('/')

/**
 * Casa a rota com o item respeitando a fronteira de segmento: `/vendas/pedidos` cobre
 * `/vendas/pedidos/123`, mas não `/vendas/pedidos-antigos`, que apenas compartilha o prefixo
 * textual. A raiz é comparada só por igualdade, senão cobriria o sistema inteiro.
 */
const cobre = (href: string, pathname: string): boolean => {
    if (href === '/') return pathname === '/'

    return pathname === href || pathname.startsWith(`${href}/`)
}

function achatar(itens: IMenuItem[], secaoId: string): Array<{ item: IMenuItem; secaoId: string }> {
    return itens.flatMap((item) => [{ item, secaoId }, ...(item.children ? achatar(item.children, secaoId) : [])])
}

/**
 * Item de menu correspondente à rota atual.
 *
 * Vence o casamento mais específico: numa rota como `/vendas/pedidos/inserir`, tanto `/vendas/pedidos`
 * quanto `/vendas/pedidos/inserir` cobrem o caminho, e marcar os dois deixaria o menu com duas
 * indicações de "você está aqui".
 */
export function useActiveMenuItem(secoes: IMenuSection[]): ItemAtivo {
    // No app de origem, `usePathname()`; na lib, a rota chega pelo provider.
    const { pathname } = useSidebarContext()

    return useMemo(() => {
        const candidatos = secoes
            .flatMap((secao) => achatar(secao.items, secao.id))
            .filter(({ item }) => item.href && ehInterno(item.href) && cobre(item.href, pathname))

        if (candidatos.length === 0) return { itemAtivoId: null, areaAtivaId: null }

        const maisEspecifico = candidatos.reduce((melhor, atual) =>
            (atual.item.href?.length ?? 0) > (melhor.item.href?.length ?? 0) ? atual : melhor,
        )

        return { itemAtivoId: maisEspecifico.item.id, areaAtivaId: maisEspecifico.secaoId }
    }, [secoes, pathname])
}
