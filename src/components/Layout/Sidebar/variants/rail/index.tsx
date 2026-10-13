'use client'

import React, { useEffect } from 'react'
import { useSidebarContext } from '../../useSidebarContext'
import ContextPanel from './ContextPanel'
import RailBar from './RailBar'
import { ID_PAINEL } from './RailItem'

const SELETOR_TRILHO = 'aside[data-trilho]'

/**
 * Variante de trilho com painel contextual.
 *
 * O painel sobrepõe o conteúdo, então precisa fechar sozinho nas três situações que o usuário
 * espera: Escape, clique fora e navegação. As duas primeiras seguem o padrão já usado pelo `Modal` e
 * pelo `FilterDrawer`, com listener em `document` removido no unmount; a terceira vive no próprio
 * item do painel.
 *
 * Não há elemento embrulhando trilho e painel: o trilho é `sticky` dentro da linha do layout
 * autenticado, e um `div` intermediário quebraria essa fixação em páginas longas.
 */
const SidebarRail: React.FC = () => {
    const { areaAberta, fecharPainel } = useSidebarContext()

    useEffect(() => {
        if (!areaAberta) return

        const aoTeclar = (evento: KeyboardEvent) => {
            if (evento.key !== 'Escape') return

            // Devolve o foco ao botão que abriu, senão quem navega por teclado volta para o início
            // do documento.
            const disparador = document.querySelector<HTMLButtonElement>(
                `${SELETOR_TRILHO} button[aria-expanded="true"]`,
            )

            fecharPainel()
            disparador?.focus()
        }

        const aoClicar = (evento: MouseEvent) => {
            const alvo = evento.target as HTMLElement | null

            if (!alvo) return
            // Clique no próprio trilho é ignorado: lá o botão da área já alterna o painel, e fechar
            // aqui antes desfaria a alternância.
            if (alvo.closest(`#${ID_PAINEL}`) || alvo.closest(SELETOR_TRILHO)) return

            fecharPainel()
        }

        document.addEventListener('keydown', aoTeclar)
        document.addEventListener('mousedown', aoClicar)

        return () => {
            document.removeEventListener('keydown', aoTeclar)
            document.removeEventListener('mousedown', aoClicar)
        }
    }, [areaAberta, fecharPainel])

    return (
        <>
            <RailBar />
            <ContextPanel />
        </>
    )
}

export default SidebarRail
