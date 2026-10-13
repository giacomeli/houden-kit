'use client'

import React from 'react'
import { UseFormRegister } from 'react-hook-form'
import FormError from '../FormError'

export interface SelectProps extends React.HTMLProps<HTMLSelectElement> {
    options: Array<{ name: string; value?: string | number | null; id?: string | number | null; [key: string]: unknown }>
    register?: ReturnType<UseFormRegister<any>>
    hasError?: boolean
    labelText?: string
    error?: string
    isRequired?: boolean
    inputClass?: string
    isDisabled?: boolean
    hint?: string
}

const Select: React.FC<SelectProps> = ({
    options,
    className = '',
    inputClass = '',
    placeholder = 'Selecione',
    hasError = false,
    error = '',
    register,
    value,
    labelText,
    isRequired = false,
    isDisabled = false,
    disabled = false,
    hint,
    ...rest
}) => {
    const isControlled = value !== undefined
    const isError = hasError || Boolean(error)
    const isSelectDisabled = isDisabled || disabled

    const selectElement = (
        <select
            {...rest}
            {...register}
            disabled={isSelectDisabled}
            className={`select select-sm bg-white rounded-md w-full ${isError ? 'select-error' : ''} ${inputClass || className}`}
            {...(isControlled ? { value } : { defaultValue: '' })}
        >
            <option disabled value="">
                {placeholder}
            </option>
            {options.map((option, key) => (
                <option value={option.value ?? option.id ?? ''} key={key}>
                    {option.name ? option.name : ((option as Record<string, unknown>).label as string)}
                </option>
            ))}
        </select>
    )

    if (!labelText) {
        return selectElement
    }

    return (
        <label className={`flex flex-col items-start justify-start font-bold text-sm dark:text-white text-black ${className}`}>
            <span className="flex gap-2 content-center items-center">
                {labelText} {isRequired && <span className="text-error text-lg">*</span>}
            </span>
            {selectElement}
            {hint && <p className="label text-[10px] text-gray-400">{hint}</p>}
            {error && <FormError>{error}</FormError>}
        </label>
    )
}

export default Select
