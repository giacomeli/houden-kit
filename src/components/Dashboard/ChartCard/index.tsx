import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
import { iconDefaults } from '../../../icons/defaults'

interface CardProps {
    title: string
    children: React.ReactNode
    className?: string
}

const ChartCard: React.FC<CardProps> = ({ title, children, className = '' }) => {
    const [toggleClass, setToggleClass] = useState(false)

    function handleToggleCardSize() {
        setToggleClass(!toggleClass)
    }

    return (
        <div
            className={`h-full w-full bg-white dark:bg-neutral rounded-lg shadow p-4 ${toggleClass ? 'col-span-2' : ''} ${className}`}
        >
            <div className="flex justify-between text-dark-gray dark:text-neutral-content">
                <p>{title}</p>
                {toggleClass ? (
                    <Minus {...iconDefaults} className="cursor-pointer text-xl" onClick={handleToggleCardSize} />
                ) : (
                    <Plus {...iconDefaults} className="cursor-pointer text-xl" onClick={handleToggleCardSize} />
                )}
            </div>
            {children}
        </div>
    )
}

export default ChartCard
