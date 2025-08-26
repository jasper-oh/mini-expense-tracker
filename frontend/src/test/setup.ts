import { config } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { vi } from 'vitest';

// Mock environment variables
vi.mock('import.meta.env', () => ({
    VITE_API_BASE_URL: 'http://localhost:3333',
}));

// Mock axios with proper types
const mockAxios = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
};

vi.mock('axios', () => ({
    default: mockAxios,
}));

// Export mock for use in tests
export { mockAxios };

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
    value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
    },
    writable: true,
});

// Global test utilities
export function createTestPinia() {
    const pinia = createPinia();
    setActivePinia(pinia);
    return pinia;
}

// Configure Vue Test Utils
config.global.plugins = [];
config.global.stubs = {
    'router-link': true,
    'router-view': true,
};
