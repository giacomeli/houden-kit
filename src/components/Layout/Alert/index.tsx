interface IAlertProps {
    message: string
    icon: React.ReactNode
    className: string
}

const Alert: React.FC<IAlertProps> = ({ message, icon, className }) => {
    return (
        <div role="alert" className={`alert ${className}`}>
            {icon}
            <span>{message}</span>
        </div>
    )
}

export default Alert
