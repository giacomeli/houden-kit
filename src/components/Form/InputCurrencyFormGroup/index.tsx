import FormError from '../FormError'
import InputCurrency from '../InputCurrency'
import Label from '../Label'

export interface IInputCurrencyFormGroupProps {
    labelText: string
    error?: string
    isRequired?: boolean
    className?: string
    inputClass?: string
    isDisabled?: boolean
    tooltipText?: string
    tooltipContent?: string | React.ReactNode
    control: any
    name: string
}

const InputCurrencyFormGroup: React.FC<IInputCurrencyFormGroupProps> = ({
    inputClass = '',
    labelText,
    error = '',
    isRequired = false,
    className = '',
    isDisabled = false,
    tooltipText = '',
    tooltipContent = '',
    control,
    name,
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
            <InputCurrency
                control={control}
                name={name}
                disabled={isDisabled}
                className={inputClass}
                hasError={Boolean(error)}
            />
            {error && <FormError>{error}</FormError>}
        </Label>
    )
}

export default InputCurrencyFormGroup
