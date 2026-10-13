import { dispatchNavigationStart } from 'houden-kit'
import { useNavigate } from 'react-router'

/**
 * `navigate()` com a barra de progresso. Clique em link já dispara o evento sozinho; navegação
 * programática dispara aqui, como o `useAppRouter` do app de origem faz.
 */
export function useNavigateWithProgress() {
    const navigate = useNavigate()
    return (to: string) => {
        dispatchNavigationStart(to)
        navigate(to)
    }
}
