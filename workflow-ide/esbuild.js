//@ts-check
import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');
const minify = process.argv.includes('--minify');

const ctx = await esbuild.context({
    entryPoints: ['src/cli/main.ts'],
    outdir: 'dist',
    bundle: true,
    target: "es2023",
    loader: { '.ts': 'ts' },
    platform: 'node', // VSCode extensions run in a node process
    sourcemap: !minify,
    minify
});

if (watch) {
    await ctx.watch();
} else {
    await ctx.rebuild();
    ctx.dispose();
}