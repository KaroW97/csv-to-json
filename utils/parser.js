const { VALID_SEPARATORS } = require("./common")

const splitToRows = data => data.split('\n')

/**
 *
 * @param {string[]} data
 * @param {string} separator
 */
const getHeaders = (data, separator) => data[0].split(separator)

const parseToJSON = ({ rest, header }) => rest.map(row => {
  return header.reduce((prev, current, index) => ({
    ...prev,
    [`${current.trim()}`]: typeof row[index] === 'string' ? row[index].trim() : row[index]
  }), {})
})

const createTempObject = (rows, separator) => {
  return {
    rest: rows.map(rowElement => rowElement.split(separator))
  }
}

const checkSeparator = (row, separatorType) => {
  if (!separatorType) {
    const separatorIndex = VALID_SEPARATORS.findIndex(element => !row[0].length ? row[1].includes(element) : row[0].includes(element))
    return VALID_SEPARATORS[separatorIndex]
  }
  return separatorType
}

module.exports = {
  getHeaders,
  splitToRows,
  parseToJSON,
  createTempObject,
  checkSeparator
}