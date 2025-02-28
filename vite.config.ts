import { UserConfig } from 'vite';
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';

/** @type {import('vite').UserConfig} */
export default {
    build: {
        outDir: 'web-dist',
        target: 'es2023',
        modulePreload: {
            polyfill: false
        },
    },
    resolve: {
        //dedupe: ['vscode']
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                importMetaUrlPlugin
            ]
        },
        include: [
            //'@testing-library/react',
            'vscode/localExtensionHost',
            'vscode-textmate',
            //'vscode-oniguruma'
        ]
    },
    server: {
        port: 5173
    },
    worker: {
        format: "es"
    },
} satisfies UserConfig;
