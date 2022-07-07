module.exports = {
  env: {
    browser: false,
    node: true,
    commonjs: true,
    es6: true,
    jest: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'max-len': ['error', { code: 100, ignoreUrls: true, ignoreComments: true }],
    'no-multiple-empty-lines': [2, { max: 2 }],
    indent: ['error', 2],
    quotes: ['error', 'single', 'avoid-escape'],
    semi: ['error', 'never'],
    'no-empty': 'warn',
    'linebreak-style': 0
  }
}
