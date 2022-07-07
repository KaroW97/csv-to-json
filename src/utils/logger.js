/**
 * Success logger
 * @param {string} path
 */
exports.loggerSuccess = (path) => {
  console.info({
    status: 200,
    message: `Save completed in file: ${path}`
  })
}
