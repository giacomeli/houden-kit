import { createBrowserRouter } from 'react-router'
import PlaygroundShell from './layout/PlaygroundShell'
import Galeria from './pages/Galeria'
import Aprovacao from './pages/padroes/Aprovacao'
import Chat from './pages/padroes/Chat'
import Detalhe from './pages/padroes/Detalhe'
import Formulario from './pages/padroes/Formulario'
import Lista from './pages/padroes/Lista'
import Painel from './pages/padroes/Painel'
import Personalizado from './pages/padroes/Personalizado'

/** Rotas em pt-BR; cada uma corresponde a um padrão de tela do template (list, detail, form...). */
export const router = createBrowserRouter(
    [
        {
            element: <PlaygroundShell />,
            children: [
                { index: true, element: <Galeria /> },
                { path: 'padroes/lista', element: <Lista /> },
                { path: 'padroes/detalhe', element: <Detalhe /> },
                { path: 'padroes/formulario', element: <Formulario /> },
                { path: 'padroes/aprovacao', element: <Aprovacao /> },
                { path: 'padroes/painel', element: <Painel /> },
                { path: 'padroes/chat', element: <Chat /> },
                { path: 'padroes/personalizado', element: <Personalizado /> },
            ],
        },
    ],
    { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
)
