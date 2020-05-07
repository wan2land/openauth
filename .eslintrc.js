module.exports = {
  env: {
    jest: true,
  },
  extends: [
    'graphity/javascript.js',
    'graphity/typescript.js',
  ],
  ignorePatterns: [
    'node_modules/',
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
}
