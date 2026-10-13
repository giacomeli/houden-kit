import { render, screen } from '@testing-library/react'
import Avatar from '../index'

describe('Avatar', () => {
    it('deve renderizar os children', () => {
        render(
            <Avatar>
                <span>JG</span>
            </Avatar>,
        )

        expect(screen.getByText('JG')).toBeInTheDocument()
    })

    it('deve aplicar className customizado', () => {
        render(
            <Avatar className="w-12 h-12">
                <span>AB</span>
            </Avatar>,
        )

        const avatarEl = screen.getByText('AB').parentElement
        expect(avatarEl?.className).toContain('w-12')
        expect(avatarEl?.className).toContain('h-12')
    })

    it('deve aplicar a classe avatar base', () => {
        render(
            <Avatar>
                <span>CD</span>
            </Avatar>,
        )

        const avatarEl = screen.getByText('CD').parentElement
        expect(avatarEl?.className).toContain('avatar')
    })

    it('deve renderizar sem className customizado', () => {
        render(
            <Avatar>
                <span>EF</span>
            </Avatar>,
        )

        const avatarEl = screen.getByText('EF').parentElement
        expect(avatarEl).toBeInTheDocument()
    })
})
