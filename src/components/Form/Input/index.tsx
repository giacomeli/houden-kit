'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { iconDefaults } from '../../../icons/defaults'
import FormError from '../FormError'

export interface InputProps {
    labelText?: string
    error?: string
    hasError?: boolean
    isRequired?: boolean
    register?: ReturnType<UseFormRegister<any>>
    isPassword?: boolean
    className?: string
    inputClass?: string
    isDisabled?: boolean
    disabled?: boolean
    placeholder?: string
    type?: string
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    value?: string | number
    defaultValue?: string | number | null
    readonly?: boolean
    readOnly?: boolean
    hint?: string
    tooltipText?: string
    tooltipContent?: string | React.ReactNode
    autoComplete?: string
    onClick?: () => void
    maxLength?: number
}

const Input: React.FC<InputProps> = ({
    type = 'text',
    className = '',
    inputClass = '',
    labelText,
    error = '',
    hasError = false,
    isRequired = false,
    register,
    isPassword = false,
    placeholder,
    isDisabled = false,
    disabled = false,
    onBlur,
    onChange,
    value,
    readonly = false,
    readOnly = false,
    hint,
    autoComplete,
    onClick,
    maxLength,
}) => {
    const [showPassword, setShowPassword] = useState(isPassword)
    const isError = hasError || Boolean(error)
    const isInputDisabled = isDisabled || disabled
    const isReadOnly = readonly || readOnly

    const inputElement = (
        <div className="relative w-full">
            <input
                type={!showPassword ? type : 'password'}
                placeholder={placeholder || labelText}
                disabled={isInputDisabled}
                readOnly={isReadOnly}
                className={`input input-sm rounded-md w-full bg-white ${isError ? 'input-error' : ''} ${inputClass}`}
                {...register}
                {...(onBlur && !register ? { onBlur } : {})}
                {...(onChange && !register ? { onChange } : {})}
                {...(value !== undefined ? { value } : {})}
                {...(autoComplete ? { autoComplete } : {})}
                {...(maxLength !== undefined ? { maxLength } : {})}
                {...(onClick ? { onClick } : {})}
            />
            {isPassword && (
                <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <Eye {...iconDefaults} /> : <EyeOff {...iconDefaults} />}
                </button>
            )}
        </div>
    )

    if (!labelText) {
        return <div className={className}>{inputElement}</div>
    }

    return (
        <label className={`flex flex-col items-start justify-start font-bold text-sm dark:text-white text-black ${className}`}>
            <span className="flex gap-2 content-center items-center">
                {labelText} {isRequired && <span className="text-error text-lg">*</span>}
            </span>
            {inputElement}
            {hint && <p className="label text-[10px] text-gray-400">{hint}</p>}
            {error && <FormError>{error}</FormError>}
        </label>
    )
}

export default Input
