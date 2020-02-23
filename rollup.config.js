import commonJs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: './src/background.js',
    output: {
      file: './lib/background.js',
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
