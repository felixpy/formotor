module.exports = {
  modulePaths: ['<rootDir>/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/src/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/test/**'
  ],
  coverageDirectory: 'test/unit/coverage'
}
