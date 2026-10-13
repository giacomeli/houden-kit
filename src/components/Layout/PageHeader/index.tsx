import type React from 'react'

export interface PageHeaderProps {
    title: string
    description?: React.ReactNode
    /** Botões e ações da tela, à direita do título. */
    actions?: React.ReactNode
    className?: string
}

/**
 * Cabeçalho de tela no padrão das telas do app de origem (`flex justify-between items-center` com o título
 * em `text-xl` e as ações à direita, como em `cadastros/grupos`).
 */
const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions, className = '' }) => {
    return (
        <div className={`flex justify-between items-center gap-4 ${className}`}>
            <div className="flex flex-col gap-1 min-w-0">
                <h1 className="text-xl">{title}</h1>
                {description && <p className="text-sm opacity-70">{description}</p>}
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
    )
}

export default PageHeader
