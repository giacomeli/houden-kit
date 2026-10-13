'use client'
import React from 'react'
import Tooltip from '../../Layout/Tooltip'

export interface ILabelProps extends React.HTMLProps<HTMLLabelElement> {
    children?: React.ReactNode
    labelText: string
    hasError?: boolean
    tooltipText?: string
    tooltipContent?: string | React.ReactNode
}

const Label: React.FC<ILabelProps> = ({
    children,
    required,
    className,
    labelText,
    tooltipText = '',
    tooltipContent = '',
    hasError = false,
    ...rest
}) => {
    return (
        <label
            className={
                className
                    ? `${className} cursor-pointer label px-0 text-black`
                    : 'flex flex-col items-start justify-start font-bold text-sm dark:text-white text-black'
            }
            {...rest}
        >
            <span className={`${hasError ? 'text-error' : 'text-normal'} flex gap-2 content-center items-center`}>
                {labelText} {required && <span className="text-error text-lg">*</span>}{' '}
                {tooltipText && <Tooltip text={tooltipText}>{tooltipContent}</Tooltip>}
            </span>
            {children}
        </label>
    )
}

export default Label
