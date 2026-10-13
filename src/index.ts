// Barrel público do houden-kit: exports nomeados. O import profundo com default export, no formato do
// app de origem (`houden-kit/components/Form/Button`), também é suportado pelo `exports` do package.json.
//
// Quando dois módulos do app de origem exportam tipos com o mesmo nome (`InputProps`), o barrel os renomeia; no
// import profundo, o nome original continua valendo.

// Gráfico
export { default as Chart } from './components/Chart'

// Chat
export { type ChatBubbleProps, default as ChatBubble } from './components/Chat/ChatBubble'
export { type ChatComposerProps, default as ChatComposer } from './components/Chat/ChatComposer'
export { type ChatMessageListProps, default as ChatMessageList } from './components/Chat/ChatMessageList'
export { default as MarkdownContent, type MarkdownContentProps } from './components/Chat/MarkdownContent'
export { default as MessageTimestamp, type MessageTimestampProps } from './components/Chat/MessageTimestamp'

// Painel
export { default as ChartCard } from './components/Dashboard/ChartCard'
export { default as DashboardCard } from './components/Dashboard/DashboardCard'

// Formulário
export { default as Button } from './components/Form/Button'
export { default as Checkbox, type ICheckboxProps } from './components/Form/Checkbox'
export { default as DatePicker, type IDatePickerProps } from './components/Form/DatePicker'
export { default as DatePickerFormGroup, type IDatePickerFormGroupProps } from './components/Form/DatePickerFormGroup'
export { default as DatePickerGroup, type IDatePickerGroupProps } from './components/Form/DatePickerGroup'
export { default as FormError, type IFormErrorProps } from './components/Form/FormError'
export { default as Input, type InputProps } from './components/Form/Input'
export { default as InputChips, type InputProps as InputChipsProps } from './components/Form/InputChips'
export { default as InputCurrency, type InputProps as InputCurrencyProps } from './components/Form/InputCurrency'
export {
    default as InputCurrencyFormGroup,
    type IInputCurrencyFormGroupProps,
} from './components/Form/InputCurrencyFormGroup'
export { default as InputFile } from './components/Form/InputFile'
export { default as Label, type ILabelProps } from './components/Form/Label'
export { default as MaskedInput, type IMaskedInputProps } from './components/Form/MaskedInput'
export { default as MultiSearchSelect } from './components/Form/MultiSearchSelect'
export { default as MultiSelect, type IMultiSelectProps } from './components/Form/MultiSelect'
export {
    default as MultiSelectFormGroup,
    type IDatePickerFormGroupProps as IMultiSelectFormGroupProps,
} from './components/Form/MultiSelectFormGroup'
export { default as SearchInput } from './components/Form/SearchInput'
export { default as SearchSelect } from './components/Form/SearchSelect'
export { default as Select, type SelectProps } from './components/Form/Select'
export { default as TextArea, type InputProps as TextAreaProps } from './components/Form/TextArea'
export {
    default as TextAreaFormGroup,
    type IFormGroupProps as ITextAreaFormGroupProps,
} from './components/Form/TextAreaFormGroup'

// Layout
export { default as Alert } from './components/Layout/Alert'
export { type AppShellProps, default as AppShell } from './components/Layout/AppShell'
export { default as Aside, type IAsideProps } from './components/Layout/Aside'
export { default as Avatar } from './components/Layout/Avatar'
export {
    type ConfirmDialogProps,
    type ConfirmDialogReason,
    default as ConfirmDialog,
} from './components/Layout/ConfirmDialog'
export { default as FilterDrawer } from './components/Layout/FilterDrawer'
export { default as LiMenu, type ILiMenuProps } from './components/Layout/LiMenu'
export { default as Loader } from './components/Layout/Loader'
export { type LoaderState, startLoading, stopLoading, useLoaderStore } from './components/Layout/Loader/loaderStore'
export { default as Logo, type LogoProps } from './components/Layout/Logo'
export { default as Modal, type ModalProps } from './components/Layout/Modal'
export { default as PageHeader, type PageHeaderProps } from './components/Layout/PageHeader'
export {
    default as RouteProgressBar,
    dispatchNavigationStart,
    NAVIGATION_START_EVENT,
    type RouteProgressBarProps,
} from './components/Layout/RouteProgressBar'
export { default as Sidebar, type SidebarProps } from './components/Layout/Sidebar'
export { filterMenuBySearch } from './components/Layout/Sidebar/filterMenuBySearch'
export {
    SidebarContext,
    type SidebarContextValue,
    SidebarProvider,
    type SidebarProviderProps,
} from './components/Layout/Sidebar/SidebarProvider'
export {
    default as SidebarUserProfile,
    type SidebarUserProfileProps,
} from './components/Layout/Sidebar/SidebarUserProfile'
export { type ItemAtivo, useActiveMenuItem } from './components/Layout/Sidebar/useActiveMenuItem'
export { useLinkComponent } from './components/Layout/Sidebar/useLinkComponent'
export { useSidebarContext } from './components/Layout/Sidebar/useSidebarContext'
export { CHAVE_VARIANTE, type SidebarVariant, useSidebarVariant } from './components/Layout/Sidebar/useSidebarVariant'
export { default as SidebarMenu } from './components/Layout/Sidebar/variants/legacy/SidebarMenu'
export { default as ContextPanel, LARGURA_PAINEL } from './components/Layout/Sidebar/variants/rail/ContextPanel'
export { default as PanelItem } from './components/Layout/Sidebar/variants/rail/PanelItem'
export { default as RailBar, LARGURA_TRILHO } from './components/Layout/Sidebar/variants/rail/RailBar'
export { default as RailItem, ID_PAINEL } from './components/Layout/Sidebar/variants/rail/RailItem'
export { default as Toaster } from './components/Layout/Toaster'
export { default as Tooltip, type TooltipProps } from './components/Layout/Tooltip'
export { default as UlMenu, type IUlMenuProps } from './components/Layout/UlMenu'

// Tabela
export { default as TanStackTable } from './components/TanStackTable'
export { default as TanStackPaginationBar } from './components/TanStackTable/TanStackPaginationBar'
export {
    type ILegacyColumn,
    type IUseLegacyTanStackTableParams,
    useLegacyTanStackTable,
} from './components/TanStackTable/useLegacyTanStackTable'

// Hooks, tema, tipos e utilitários
export { useClickOutside } from './hooks/useClickOutside'
export { ThemeContext, type ThemeContextValue, ThemeProvider, type ThemeProviderProps } from './theme/ThemeProvider'
export { applyStoredTheme, THEME_DARK, THEME_LIGHT, THEME_STORAGE_KEY, type ThemeName } from './theme/themes'
export { useTheme } from './theme/useTheme'
export type { IMenuItem, IMenuSection } from './types/menu'
export type { LinkComponent, LinkComponentProps, Slot } from './types/navigation'
export type { IMultiSelectOptions, IOption } from './types/option'
export { default as toastError } from './utils/toast/toastError'
export { default as toastSuccess } from './utils/toast/toastSuccess'
