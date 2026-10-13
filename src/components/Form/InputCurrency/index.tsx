'use client'
import React from 'react'
import { CurrencyInput } from 'react-currency-mask'
import { Controller } from 'react-hook-form'

export interface InputProps extends React.HTMLProps<HTMLInputElement> {
    name: string
    control: any
    hasError?: boolean
}

const InputCurrency: React.FC<InputProps> = ({ name, control, hasError = false, className = '', onBlur, ...rest }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <CurrencyInput
                    {...field}
                    value={field.value}
                    onChangeValue={(_, value) => {
                        field.onChange(value)
                    }}
                    onBlur={(e) => {
                        field.onBlur()
                        if (onBlur) {
                            onBlur(e)
                        }
                    }}
                    InputElement={
                        <input
                            {...rest}
                            {...field}
                            className={`input input-sm bg-white dark:bg-primary border  p-2 rounded-md w-full cursor-pointer ${className} ${
                                hasError ? 'border-red-500' : 'border-light-gray'
                            }`}
                        />
                    }
                />
            )}
        />
    )
}

export default InputCurrency
