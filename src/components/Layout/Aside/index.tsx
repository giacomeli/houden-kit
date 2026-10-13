'use client'
import React from 'react'

export interface IAsideProps extends React.HTMLProps<HTMLElement> {
    children: React.ReactNode
}

const Aside: React.FC<IAsideProps> = ({ children, className, ...rest }) => {
    return (
        <aside className={`${className} relative`} {...rest}>
            {children}
        </aside>
    )
}

export default Aside
