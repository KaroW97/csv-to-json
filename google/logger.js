exports.loggerSuccess = (statusCode, path) => {
  cconsole.info({
    status: statusCode,
    message: `Save completed in file: ${path}`
  })
}

exports.loggerError = (statusCode, name, description) => {
  deleteUndefined = JSON.parse(JSON.stringify({
    statusCode,
    name,
    description
  }))

  console.error(deleteUndefined);
}
