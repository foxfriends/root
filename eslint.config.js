module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    babelOptions: {
      configFile: './babel.config.js',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:ramda/recommended',
  ],
  env: {
    'es6': true,
    'browser': true,
  },
  plugins: [
    'svelte3',
    'ramda',
  ],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'no-multiple-empty-lines': 'off', // does not work properly
        'no-unused-vars': ['error', {
          varsIgnorePattern: '^\\$', // assigning to stored vars is usually intentional
        }],
      },
    },
  ],
  rules: {
    'arrow-parens': [1, 'always'],
    'brace-style': ['error', '1tbs', {
      'allowSingleLine': true,
    }],
    'comma-dangle': ['error', {
      'arrays': 'always-multiline',
      'objects': 'always-multiline',
      'imports': 'always-multiline',
      'exports': 'always-multiline',
      'functions': 'always-multiline',
    }],
    'curly': 'error',
    'eol-last': ['error', 'always'],
    'indent': ['error', 2, {
      'SwitchCase': 1,
    }],
    'newline-before-return': 'off',
    'no-console': 'error',
    'no-constant-condition': 'off',
    'no-multiple-empty-lines': ['error', {
      'max': 1,
      'maxBOF': 0,
      'maxEOF': 0,
    }],
    'no-prototype-builtins': 'off',
    'no-unused-vars': 'error',
    'object-curly-spacing': ['error', 'always'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'space-before-function-paren': ['error', {
      'anonymous': 'always',
      'named': 'never',
      'asyncArrow': 'always',
    }],
    'no-inner-declarations': 'off',
    'ramda/cond-simplification': 'off', // I don't agree, sometimes cond is more meaningfully correct?
    'ramda/map-simplification': 'off', // it often gets confused with map from rxjs
  },
  settings: {
    'svelte3/ignore-styles': () => true,
  },
};
