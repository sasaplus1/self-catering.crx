module.exports = {
  '*.css': ['npx stylelint --cache', 'npx prettier --check'],
  '*.{js,jsx,ts,tsx}': ['npx eslint --cache', 'npx prettier --check'],
  '*.yml': 'npx prettier --check --parser yaml',
  'package.json': [
    'npx fixpack',
    'npx prettier --check --parser json-stringify'
  ],
  'package-lock.json': 'node -e "process.exitCode = 1;"'
};
