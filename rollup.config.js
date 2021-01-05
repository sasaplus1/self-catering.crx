import commonJs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default [
  {
    input: './src/background.ts',
    output: {
      file: './lib/background.js',
      format: 'iife',
      name: 'background',
      sourcemap: true
    },
    plugins: [typescript(), nodeResolve(), commonJs()]
  },
  {
    input: './src/options.ts',
    output: {
      file: './lib/options.js',
      format: 'iife',
      name: 'options',
      sourcemap: true
    },
    plugins: [typescript(), nodeResolve(), commonJs()]
  }
];
