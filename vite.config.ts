import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';
import { stringPlugin } from 'vite-string-plugin';
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [
        stringPlugin({match: /\.(dataspace)$/i}),
    ],
    build: {
        outDir: 'web-dist',
        target: 'es2023',
        modulePreload: {
            polyfill: false
        },
    },
    resolve: {
        dedupe: ['vscode']
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                importMetaUrlPlugin
            ]
        },
        include: [
            'langium',
            'langium/lsp',
            'langium/grammar',
            'vscode/localExtensionHost',
            'vscode-jsonrpc',
            'vscode-languageclient',
            'vscode-languageserver',
            'vscode-languageserver/browser.js',
            'vscode-languageserver-protocol'
        ]
    },
    server: {
        port: 5173
    },
    worker: {
        format: "es"
    },
});
