'use client'
import React from 'react'

export interface IFormErrorProps {
    children: React.ReactNode
}

const FormError: React.FC<IFormErrorProps> = ({ children }) => {
    return <span className="text-error text-xs">{children}</span>
}

export default FormError
