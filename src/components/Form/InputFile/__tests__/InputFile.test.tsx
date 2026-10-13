import { fireEvent, render, screen } from '@testing-library/react'
import InputFile from '../index'

// Mock react-dropzone
vi.mock('react-dropzone', () => ({
    useDropzone: ({ onDrop }: any) => ({
        getRootProps: () => ({
            onClick: () => {
                // Simula seleção de arquivo ao clicar
            },
            'data-testid': 'dropzone',
        }),
        getInputProps: () => ({
            'data-testid': 'dropzone-input',
        }),
        onDrop,
    }),
}))

describe('InputFile', () => {
    const defaultProps = {
        maxFiles: 3,
        setFiles: vi.fn(),
        files: [] as File[],
    }

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('deve renderizar o label "Anexo"', () => {
        render(<InputFile {...defaultProps} />)
        expect(screen.getByText('Anexo')).toBeInTheDocument()
    })

    it('deve renderizar o texto de instrucao do dropzone', () => {
        render(<InputFile {...defaultProps} />)
        expect(screen.getByText('Arraste e solte ou clique para selecionar arquivos')).toBeInTheDocument()
    })

    it('deve exibir a mensagem de limite de arquivos', () => {
        render(<InputFile {...defaultProps} />)
        expect(screen.getByText('* Insira no máximo 3 arquivos')).toBeInTheDocument()
    })

    it('deve exibir nomes dos arquivos quando files nao esta vazio', () => {
        const files = [
            new File(['conteudo1'], 'documento.pdf', { type: 'application/pdf' }),
            new File(['conteudo2'], 'imagem.png', { type: 'image/png' }),
        ]
        render(<InputFile {...defaultProps} files={files} />)
        expect(screen.getByText('documento.pdf')).toBeInTheDocument()
        expect(screen.getByText('imagem.png')).toBeInTheDocument()
    })

    it('deve chamar setFiles para remover arquivo ao clicar no icone de remover', () => {
        const files = [
            new File(['conteudo1'], 'documento.pdf', { type: 'application/pdf' }),
            new File(['conteudo2'], 'imagem.png', { type: 'image/png' }),
        ]
        const { container } = render(<InputFile {...defaultProps} files={files} />)

        // O ícone de remover é o X do lucide (no app de origem, FontAwesomeIcon mockado com data-testid)
        const removeIcons = container.querySelectorAll('svg.lucide-x')
        fireEvent.click(removeIcons[0])

        expect(defaultProps.setFiles).toHaveBeenCalledTimes(1)
        const setFilesArg = defaultProps.setFiles.mock.calls[0][0]
        expect(setFilesArg).toHaveLength(1)
        expect(setFilesArg[0].name).toBe('imagem.png')
    })

    it('nao deve exibir lista de arquivos quando files esta vazio', () => {
        render(<InputFile {...defaultProps} />)
        expect(screen.queryByText('documento.pdf')).not.toBeInTheDocument()
    })

    it('deve renderizar area de dropzone', () => {
        render(<InputFile {...defaultProps} />)
        expect(screen.getByTestId('dropzone')).toBeInTheDocument()
    })
})
