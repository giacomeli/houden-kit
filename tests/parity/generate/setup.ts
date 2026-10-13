// Setup do gerador (lado do app de origem). Mocks só do que não chega ao DOM dos componentes renderizados.
import { createRequire } from 'node:module'
import { dirname } from 'node:path'

vi.mock('react-toastify', () => ({
    toast: Object.assign(vi.fn(), {
        success: vi.fn(),
        error: vi.fn(),
        warning: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        dismiss: vi.fn(),
    }),
    ToastContainer: () => null,
}))

// O react-currency-mask 1.3.3 do app de origem declara `react ^18` como dependência e traz um React 18 aninhado,
// o que quebra os hooks do InputCurrency fora de um bundler (o teste do próprio app de origem mocka o pacote).
// Em produção, o bundler do Next resolve tudo para uma cópia só do React; aqui o mesmo efeito vem de
// apontar, no cache do `require`, os caminhos aninhados para o React do app de origem.
const requireHere = createRequire(import.meta.url)
const maskEntry = createRequire(`${dirname(requireHere.resolve('react-currency-mask/package.json'))}/lib/index.js`)
for (const id of ['react', 'react/jsx-runtime']) {
    const top = requireHere.resolve(id)
    const nested = maskEntry.resolve(id)
    if (nested !== top) {
        requireHere(top)
        requireHere.cache[nested] = requireHere.cache[top]
    }
}

// Componentes adaptados (Sidebar, RouteProgressBar): o que no app de origem vinha de Next.js, sessão e regra de
// acesso é mockado aqui, e a lib recebe o mesmo por prop. O `useSidebarMenu` é o real do app de origem, com os
// grants liberados e o `SIDEBAR_MENU` trocado pelo menu do caso: a busca dele é comparada com a da lib.
const parity = globalThis as any
parity.__parityPathname = '/'
parity.__parityMenu = []

vi.mock('next/navigation', () => ({
    usePathname: () => (globalThis as any).__parityPathname,
    useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn(), prefetch: vi.fn(), back: vi.fn() }),
    useSearchParams: () => new URLSearchParams(),
}))
vi.mock('next/link', async () => {
    const { createElement } = await import('react')
    return {
        default: ({ children, href, prefetch: _prefetch, ...props }: any) =>
            createElement('a', { href, ...props }, children),
    }
})
vi.mock('next/image', async () => {
    const { createElement } = await import('react')
    return { default: ({ src, alt }: any) => createElement('img', { src, alt }) }
})
vi.mock('~/config/sidebarMenu', () => ({ SIDEBAR_MENU: (globalThis as any).__parityMenu }))
vi.mock('~/hooks/business/auth/useGrants', () => ({
    useGrants: () => ({
        hasAnyGrant: () => true,
        hasAllGrants: () => true,
        hasAnyRole: () => true,
        hasModule: () => true,
    }),
}))
vi.mock('@/hooks/business/auth/useAuth', () => ({ useAuth: () => ({ signOut: vi.fn() }) }))
vi.mock('~/stores/useAuthStore', () => ({
    useAuthStore: (selector: (state: unknown) => unknown) => selector({ user: { email: 'ana.souza@houden.com.br' } }),
}))

// Node 22+ expõe um `localStorage` próprio que fica `undefined` sem flag e vence o do jsdom (mesmo
// contorno do `src/test/setup.ts` do app de origem). A variante da Sidebar é lida de lá.
class MemoryStorage implements Storage {
    private map = new Map<string, string>()
    get length() {
        return this.map.size
    }
    key(index: number) {
        return Array.from(this.map.keys())[index] ?? null
    }
    getItem(key: string) {
        return this.map.has(key) ? (this.map.get(key) as string) : null
    }
    setItem(key: string, value: string) {
        this.map.set(String(key), String(value))
    }
    removeItem(key: string) {
        this.map.delete(key)
    }
    clear() {
        this.map.clear()
    }
}
for (const name of ['localStorage', 'sessionStorage'] as const) {
    if (typeof (globalThis as any)[name]?.setItem !== 'function') {
        Object.defineProperty(globalThis, name, { value: new MemoryStorage(), configurable: true, writable: true })
    }
}
