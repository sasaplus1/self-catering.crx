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
      allowModules: ['@rollup/plugin-commonjs', '@rollup/plugin-node-resolve']
    }
  }
};
