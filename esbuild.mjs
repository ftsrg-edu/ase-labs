//@ts-check
import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');
const minify = process.argv.includes('--minify');

const ctx = await esbuild.context({
    external: ['vscode'],
    // Entry points for the vscode extension and the language server
    entryPoints: [
        'src/extension/main.ts', 
        'src/language/runner/lsp-server.ts', 
        'src/cli/main.ts'
    ],
    outdir: 'dist',
    bundle: true,
    target: "ES2023",
    format: 'cjs',
    outExtension: {
        ".js": ".cjs"
    },
    loader: { '.ts': 'ts' },
    platform: 'node',
    sourcemap: !minify,
    minify
});

if (watch) {
    await ctx.watch();
} else {
    await ctx.rebuild();
    await ctx.dispose();
}
