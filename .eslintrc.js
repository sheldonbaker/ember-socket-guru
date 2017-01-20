module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: 'netguru-ember',
  globals: {
    Pusher: true,
    io: true,
  },
  env: {
    browser: true
  },
  rules: {
    'no-multiple-empty-lines': ['error', {
      max: 1,
      maxEOF: 0,
      maxBOF: 0,
    }],
  }
};
