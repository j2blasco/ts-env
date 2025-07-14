import { defineConfig } from 'tsup';

export default defineConfig([
  // Main library build
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    outDir: 'dist',
    dts: true,
    splitting: false,
    sourcemap: false,
    clean: true,
    outExtension: ({ format }) => ({
      js: format === 'cjs' ? '.cjs' : '.js',
    }),
  },
  // CLI build - separate entry for the bin file
  {
    entry: ['src/bin/cli.ts'],
    format: ['cjs'],
    outDir: 'dist/bin',
    dts: false,
    splitting: false,
    sourcemap: false,
    clean: false,
    outExtension: () => ({ js: '.cjs' }),
  },
]);
