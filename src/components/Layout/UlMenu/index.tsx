'use client'
import React from 'react'

export interface IUlMenuProps extends React.HTMLProps<HTMLUListElement> {
    children: React.ReactNode
}

const UlMenu: React.FC<IUlMenuProps> = ({ children, className, ...rest }) => {
    return (
        <ul className={`menu ${className}`} {...rest}>
            {children}
        </ul>
    )
}

export default UlMenu
