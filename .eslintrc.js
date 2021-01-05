module.exports = {
  env: {
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:node/recommended-script', 'prettier'],
  overrides: [
    {
      extends: [
        'eslint:recommended',
        'plugin:node/recommended-module',
        'prettier'
      ],
      files: ['rollup.config.js']
    },
    {
      env: {
        node: true
      },
      files: ['src/manifest.js']
    },
    {
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:node/recommended-module',
        'prettier/@typescript-eslint'
      ],
      env: {
        browser: true,
        webextensions: true
      },
      files: ['src/**/*.{ts,tsx}'],
      parser: '@typescript-eslint/parser'
    },
    {
      extends: [
        'eslint:recommended',
        'plugin:node/recommended-module',
        'prettier'
      ],
      env: {
        browser: true,
        webextensions: true
      },
      files: ['src/**/!(manifest)*.js']
    }
  ],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module'
  },
  root: true,
  settings: {
    node: {
      allowModules: ['@rollup/plugin-commonjs', '@rollup/plugin-node-resolve'],
      tryExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json', '.node']
    }
  }
};
