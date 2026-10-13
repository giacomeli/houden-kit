export interface TooltipProps {
    children: React.ReactNode
    text: string
    className?: string
}

const Tooltip: React.FC<TooltipProps> = ({ children, text, className }) => {
    return (
        <div data-tip={text} className={`tooltip ${className}`}>
            {children}
        </div>
    )
}

export default Tooltip
