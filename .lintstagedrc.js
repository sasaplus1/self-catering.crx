module.exports = {
  '*.css': ['npx stylelint --cache', 'npx prettier --check'],
  '*.js': ['npx eslint --cache', 'npx prettier --check'],
  '*.yml': [
    'npx prettier --parser yaml --write',
    'git diff --exit-code --quiet'
  ],
  'package.json': [
    'npx fixpack',
    'npx prettier --parser json-stringify --write',
    'git diff --exit-code --quiet'
  ],
  'package-lock.json': 'node -e "process.exitCode = 1;"'
};
