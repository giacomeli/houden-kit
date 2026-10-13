'use client'

import { useEffect, useState } from 'react'

export type SidebarVariant = 'legacy' | 'rail'

const VARIANTES: readonly SidebarVariant[] = ['legacy', 'rail']

const PADRAO: SidebarVariant = 'legacy'

/** Chave da preferência no navegador. Exposta para os testes e para a limpeza manual. */
export const CHAVE_VARIANTE = 'houden-kit.sidebarVariant'

const PARAMETRO = 'sidebar'

const normalizar = (valor: string | null | undefined): SidebarVariant | null =>
    VARIANTES.includes(valor as SidebarVariant) ? (valor as SidebarVariant) : null

/**
 * Variante da barra a renderizar, em duas camadas.
 *
 * O parâmetro `defaultVariant` define o padrão do ambiente (no app de origem, a env
 * `NEXT_PUBLIC_SIDEBAR_VARIANT`); o parâmetro `?sidebar=` da URL sobrepõe e grava a escolha no
 * navegador. A segunda camada existe porque o padrão é fixado no build: sem ela, comparar os dois
 * desenhos exigiria um deploy por variante, que é justamente o que a convivência das duas pretende
 * evitar.
 *
 * A leitura do armazenamento acontece em efeito, não no corpo: no servidor ele não existe, e ler
 * direto quebraria a hidratação. Até o efeito rodar vale o padrão do ambiente, o mesmo que o
 * servidor renderizou.
 */
export function useSidebarVariant(defaultVariant: SidebarVariant = PADRAO): SidebarVariant {
    const [preferencia, setPreferencia] = useState<SidebarVariant | null>(null)

    useEffect(() => {
        try {
            const doParametro = normalizar(new URLSearchParams(window.location.search).get(PARAMETRO))

            if (doParametro) {
                window.localStorage.setItem(CHAVE_VARIANTE, doParametro)
                setPreferencia(doParametro)
                return
            }

            setPreferencia(normalizar(window.localStorage.getItem(CHAVE_VARIANTE)))
        } catch {
            // Navegação privada ou armazenamento bloqueado: segue com o padrão do ambiente.
            setPreferencia(null)
        }
    }, [])

    return preferencia ?? normalizar(defaultVariant) ?? PADRAO
}
