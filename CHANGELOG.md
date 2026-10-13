# houden-kit

## 0.1.0

Primeira versão: port 1 para 1 dos componentes do app de origem (commit `1e5c1c3e`), verificado por teste de paridade, em Tailwind CSS 4 e DaisyUI 5, com os temas `houdenTheme` e `houdenThemeDark`.

- **Formulário:** Button, Checkbox, DatePicker, DatePickerFormGroup, DatePickerGroup, FormError, Input, InputChips, InputCurrency, InputCurrencyFormGroup, InputFile, Label, MaskedInput, MultiSearchSelect, MultiSelect, MultiSelectFormGroup, SearchInput, SearchSelect, Select, TextArea, TextAreaFormGroup.
- **Tabela:** TanStackTable, TanStackPaginationBar e useLegacyTanStackTable, com `houden-kit/table` reexportando o `@tanstack/react-table`.
- **Layout:**
  - Alert, Aside, Avatar, FilterDrawer, LiMenu, Modal, Tooltip e UlMenu.
  - Sidebar adaptada, nas variantes `legacy` e `rail`, com menu, rota, link, logo e perfil por prop.
  - Loader sem Zustand, RouteProgressBar com o evento `navigation:start` público, e Toaster.
- **Painel e chat:** DashboardCard, ChartCard, Chart e MessageTimestamp.
- **Componentes novos:** AppShell, Logo, PageHeader, ConfirmDialog, ThemeProvider e useTheme, ChatBubble, ChatMessageList, ChatComposer e MarkdownContent.
- **Ícones:** só `lucide-react`, com `houden-kit/icons` reexportando a biblioteca. O FontAwesome do app de origem não entra no pacote.
- **CSS:** `houden-kit/theme.css` (temas, variante `dark`, CSS do react-toastify) e `houden-kit/fonts.css` (Inter servida do pacote), gerados pelo Tailwind do consumidor.
- **CSP:** funciona sem `unsafe-inline` e sem CDN. Exige `img-src 'self' data:` por causa dos SVG em `data:` do DaisyUI.

Os defeitos herdados do app de origem estão no `PORTING.md`, e a correção começa na 0.2.0.
