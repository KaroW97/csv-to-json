module.exports = {
  // Flag to indicate if Code Coverage to be collected and reported
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage
  // information should be collected
  collectCoverageFrom: [
    'src/bigFileCreator/*.js',
    'src/csvToJSON/*.js',
    'src/google/*.js',
    'src/utils/*.js'
  ],

  coverageThreshold: {
    global: {
      statements: 50,
      branches: 50,
      functions: 50,
      lines: 50
    }
  }
}
