module.exports = {
  globals: {
    React: true,
    google: true,
    mount: true,
    mountWithRouter: true,
    shallow: true,
    shallowWithRouter: true,
    context: true,
    expect: true,
    jsdom: true,
    JSX: true,
  },
  env: {
    browser: true,
    es2022: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb-typescript',
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    include: ['./tsconfig.json'],
    ecmaVersion: 13,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'max-len': 'off',
    'react/jsx-no-constructed-context-values': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    "react/require-default-props": "off",
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    "import/no-unresolved": [
      2,
      { "caseSensitive": false },
    ],
  },
  settings: {
    'import/resolver': 'webpack',
  },
};
