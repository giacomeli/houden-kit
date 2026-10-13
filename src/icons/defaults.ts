import type { LucideProps } from 'lucide-react'

/**
 * Props padrão dos ícones lucide nos componentes portados do app de origem (requisito 11 da spec).
 *
 * `size: '1em'` reproduz o tamanho do FontAwesome, que segue o texto ao redor, para o layout não se
 * mover. `strokeWidth: 1.75` é a convenção do trilho da Sidebar do app de origem. `aria-hidden` repete o que o
 * FontAwesome renderizava.
 */
export const iconDefaults = { size: '1em', strokeWidth: 1.75, 'aria-hidden': true } satisfies LucideProps
