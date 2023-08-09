module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    // runtime: 'automatic' is so we can use implicit React imports
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
};
