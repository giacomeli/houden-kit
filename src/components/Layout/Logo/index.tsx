export interface LogoProps {
    /** Forma compacta, para o trilho de 72 px e para a barra legada recolhida. */
    compact?: boolean
    className?: string
}

/**
 * Logo em texto do houden-kit, padrão do slot `logo` da Sidebar. As cores supõem o fundo `bg-primary`
 * da barra; fora dela, ajuste por `className`. O app pode trocar o logo inteiro pelo slot.
 */
const Logo: React.FC<LogoProps> = ({ compact = false, className = '' }) => {
    if (compact) {
        return (
            <span
                role="img"
                aria-label="Houden-kit"
                className={`flex size-9 shrink-0 items-center justify-center rounded-box bg-accent text-accent-content text-sm font-bold ${className}`}
            >
                HK
            </span>
        )
    }

    return (
        <span className={`whitespace-nowrap text-base font-bold tracking-tight text-primary-content ${className}`}>
            Houden<span className="text-accent">-kit</span>
        </span>
    )
}

export default Logo
