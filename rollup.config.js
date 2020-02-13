import commonJs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: './src/popup.js',
    output: {
      file: './lib/popup.js',
      format: 'iife',
      name: 'popup',
      sourcemap: true
    },
    plugins: [nodeResolve(), commonJs()]
  },
  {
    input: './src/options.js',
    output: {
      file: './lib/options.js',
      format: 'iife',
      name: 'popup',
      sourcemap: true
    },
    plugins: [nodeResolve(), commonJs()]
  }
];
