import { Info } from 'lucide-react'
import { iconDefaults } from '../../../icons/defaults'
import Tooltip from '../../Layout/Tooltip'

interface IDashboardCardProps extends React.HTMLProps<HTMLDivElement> {
    icon: React.ReactNode
    title: string
    description: string
    value: string
}

const DashboardCard: React.FC<IDashboardCardProps> = ({ icon, title, description, value, className = '' }) => {
    return (
        <div className={`bg-white dark:bg-neutral p-2 flex gap-2 shadow items-center ${className}`}>
            <div className="bg-accent/40 text-accent text-3xl rounded p-2 max-h-[68px] max-w-[68px]">{icon}</div>
            <div className="text-black dark:text-white ">
                <div className="text-sm flex items-center gap-1 mb-1">
                    <span>{title}</span>
                    <Tooltip text={description}>
                        <Info {...iconDefaults} className="text-secondary" />
                    </Tooltip>
                </div>
                <p className="font-bold text-lg">{value}</p>
            </div>
        </div>
    )
}

export default DashboardCard
