import '@testing-library/jest-dom/vitest'

// Port de `src/test/setup.ts` do app de origem (commit-base 1e5c1c3e), sem os mocks de `next/navigation`,
// `sweetalert2` e `nookies`, que a lib não usa.

// Mock global: react-toastify
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

// Node 22+ expõe um global `localStorage`/`sessionStorage` próprio (Web Storage do Node) que fica
// `undefined` sem a flag `--localstorage-file` e vence o do jsdom ao popular o `window` do Vitest.
// Instala um Storage em memória sempre que o global vier ausente.
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
