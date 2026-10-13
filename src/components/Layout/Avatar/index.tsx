import React from 'react'

interface IAvatarProps {
    className?: string
    children?: React.ReactNode
}

const Avatar: React.FC<IAvatarProps> = ({ className, children }) => {
    return <div className={`avatar ${className}`}>{children}</div>
}

export default Avatar
