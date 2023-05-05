import typescript from '@rollup/plugin-typescript'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MixTagInput',
      fileName: 'MixTagInput',
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React',
        },
      },
      plugins: [require('@rollup/plugin-typescript')({
        tsconfig: './tsconfig.json',
        lib: ['es5', 'es6', 'es2022', 'dom'],
        target: 'es2022',
      })],
    },
  },
})
