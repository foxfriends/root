module.exports = {
  exclude: /node_modules/,
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-throw-expressions',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-private-methods',
    '@babel/plugin-proposal-function-bind',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
  ],
};
