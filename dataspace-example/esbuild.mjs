//@ts-check
import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');
const minify = process.argv.includes('--minify');

const ctx = await esbuild.context({
    external: ['express'],
    entryPoints: [
        'src/service-chain/*.ts',
        'src/server-runner/*.ts',
    ],
    outdir: 'dist',
    bundle: true,
    target: "ES2023",
    format: 'esm',
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
