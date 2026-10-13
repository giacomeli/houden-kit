import type { LinkComponentProps } from 'houden-kit'
import { Link } from 'react-router'

/** Adaptador do `linkComponent` da lib para o react-router, que usa `to` no lugar de `href`. */
export function RouterLink({ href, ...props }: LinkComponentProps) {
    return <Link to={href} {...props} />
}
