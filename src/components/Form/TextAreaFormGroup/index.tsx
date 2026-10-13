import { UseFormRegister } from 'react-hook-form'
import FormError from '../FormError'
import Label from '../Label'
import TextArea from '../TextArea'

export interface IFormGroupProps {
    labelText: string
    error?: string
    isRequired?: boolean
    register?: ReturnType<UseFormRegister<any>>
    isPassword?: boolean
    className?: string
    inputClass?: string
    isDisabled?: boolean
    type?: string
    tooltipText?: string
    tooltipContent?: string | React.ReactNode
    readonly?: boolean
}

const TextAreaFormGroup: React.FC<IFormGroupProps> = ({
    type = 'text',
    inputClass = '',
    labelText,
    error = '',
    isRequired = false,
    register,
    isPassword = false,
    className = '',
    isDisabled = false,
    tooltipText = '',
    tooltipContent = '',
    readonly = false,
}) => {
    return (
        <Label
            tooltipText={tooltipText}
            tooltipContent={tooltipContent}
            required={isRequired}
            className={`flex flex-col items-start justify-start font-bold text-sm dark:text-white ${className}`}
            hasError={Boolean(error)}
            labelText={labelText}
        >
            <TextArea
                disabled={isDisabled}
                readOnly={readonly}
                type={type}
                register={register}
                hasError={Boolean(error)}
                isPassword={isPassword}
                className={inputClass}
            />
            {error && <FormError>{error}</FormError>}
        </Label>
    )
}

export default TextAreaFormGroup
