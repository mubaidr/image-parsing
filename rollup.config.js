import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import builtins from 'rollup-plugin-node-builtins'
import externals from 'rollup-plugin-node-externals'
import globals from 'rollup-plugin-node-globals'

export default [
  {
    input: './src/utilities/workers/extract.worker.ts',
    output: {
      file: 'dist_electron/workers/extract.worker.js',
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      externals({
        // The path(s) to your package.json. Optional.
        // Can be a string or an array of strings for monorepos -- see below
        packagePath: './package.json',

        // Make node builtins external. Optional. Default: true
        builtins: true,

        // Make pkg.dependencies external. Optional. Default: false
        deps: true,

        // Make pkg.peerDependencies external. Optional. Default: true
        peerDeps: true,

        // Make pkg.optionalDependencies external. Optional. Default: true
        optDeps: true,

        // Make pkg.devDependencies external. Optional. Default: true
        devDeps: true,

        // Modules to exclude from externals. Optional. Default: none
        exclude: [],

        // Modules to include in externals. Optional. Default: all
        include: [],
      }),
      json(),
      globals(),
      builtins(),
      nodeResolve(),
      commonjs(),
      typescript(),
      babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
    ],
  },
  {
    input: './src/utilities/workers/compile.worker.ts',
    output: {
      file: 'dist_electron/workers/compile.worker.js',
      format: 'cjs',
    },
    plugins: [
      externals({
        // The path(s) to your package.json. Optional.
        // Can be a string or an array of strings for monorepos -- see below
        packagePath: './package.json',

        // Make node builtins external. Optional. Default: true
        builtins: true,

        // Make pkg.dependencies external. Optional. Default: false
        deps: true,

        // Make pkg.peerDependencies external. Optional. Default: true
        peerDeps: true,

        // Make pkg.optionalDependencies external. Optional. Default: true
        optDeps: true,

        // Make pkg.devDependencies external. Optional. Default: true
        devDeps: true,

        // Modules to exclude from externals. Optional. Default: none
        exclude: [],

        // Modules to include in externals. Optional. Default: all
        include: [],
      }),
      json(),
      globals(),
      builtins(),
      nodeResolve(),
      commonjs(),
      typescript(),
      babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
    ],
  },
]
