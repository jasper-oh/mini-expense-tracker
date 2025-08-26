import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';
import { resolve } from 'path';

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: ['./src/test/setup.ts'],
            coverage: {
                provider: 'v8',
                reporter: ['text', 'json', 'html'],
                exclude: [
                    'node_modules/',
                    'src/test/',
                    '**/*.d.ts',
                    '**/*.config.*',
                    'dist/',
                ],
            },
        },
        resolve: {
            alias: {
                '@': resolve(__dirname, './src'),
            },
        },
    })
);
