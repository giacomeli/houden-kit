import React from 'react'

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    isLoading?: boolean
}

const Button: React.FC<IButtonProps> = ({ children, className, isLoading, disabled, ...rest }) => {
    return (
        <button
            className={`btn disabled:cursor-not-allowed ${className ? className : 'btn-accent '}`}
            disabled={disabled || isLoading}
            {...rest}
        >
            {isLoading ? <span className="loading loading-spinner loading-xs" /> : children}
        </button>
    )
}

export default Button
