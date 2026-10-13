import type { AnchorHTMLAttributes, ElementType, ReactNode } from 'react'

/**
 * Props que a lib passa ao componente de link do app. No app de origem, o link era o `next/link`; na lib,
 * qualquer componente que aceite `href` serve. Com o react-router, que usa `to`, o adaptador é:
 *
 * ```tsx
 * const RouterLink = ({ href, ...props }: LinkComponentProps) => <Link to={href} {...props} />
 * ```
 */
export type LinkComponentProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

/** Componente de link interno. Padrão: `'a'`. */
export type LinkComponent = ElementType<LinkComponentProps>

/** Conteúdo de um slot: um nó, ou uma função que recebe o contexto de quem desenha o slot. */
export type Slot<Context> = ReactNode | ((context: Context) => ReactNode)

export function renderSlot<Context>(slot: Slot<Context> | undefined, context: Context): ReactNode {
    return typeof slot === 'function' ? slot(context) : slot
}
