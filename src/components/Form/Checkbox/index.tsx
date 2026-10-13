'use client'

import React from 'react'
import { UseFormRegister } from 'react-hook-form'

export interface ICheckboxProps extends React.HTMLProps<HTMLInputElement> {
    register?: ReturnType<UseFormRegister<any>>
    toggle?: boolean
}

const Checkbox: React.FC<ICheckboxProps> = ({ className = '', register, toggle = false, ...rest }) => {
    return (
        <input
            type="checkbox"
            {...register}
            className={` ${className} ${toggle ? 'toggle toggle-accent' : 'checkbox'}`}
            {...rest}
        />
    )
}

export default Checkbox
