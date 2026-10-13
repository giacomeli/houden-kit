// houden-kit/icons: reexport completo do lucide-react. O app do template não importa bibliotecas de UI
// diretamente; um reexport parcial obrigaria uma versão nova da lib a cada ícone novo. O tree-shaking do
// consumidor remove o que não for usado.
export * from 'lucide-react'
