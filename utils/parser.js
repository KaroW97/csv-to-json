const { VALID_SEPARATORS } = require("./common")

module.exports = class Parser {
  constructor() {
    this.header = undefined
    this.separator = undefined
    this.checkIfFirst = true
    this.unprocessed = ''
  }

  /**
   * Splitting string to an array of strings
   * @param {string} data
   * @returns {string[]}
   */
  splitToRows(data) {
    return data.split('\n')
  }

  /**
   * Extracting header if its first iteration
   * @param {string[]} data
   */
  setHeader(data) {
    this.header = data[0].split(this.separator)
  }

  /**
   *
   * @param {Record<string, number>[]} json
   * @returns {string}
   */
  deleteBrackets(json) {
    return JSON.stringify(json).replace(/[\[\]']+/g, '')
  }

  /**
   * Creates map of elements splitted when correct separator occurs
   * @param {string[]} rows
   * @returns {string[]}
   */
  createTempObject(rows) {
    const splitIfHeader = this.checkIfFirst ? rows.splice(1) : rows
    return splitIfHeader.map(rowElement => rowElement.split(this.separator))
  }

  /**
   * Attaches value to correct header
   * Deletes extra brackets from array
   * Adds comma at the beginning of the string if its not first iteration
   * @param {string[]} rows
   * @returns {string}
   */
  parseToJSON(rows) {
    const rest = this.createTempObject(rows)

    const json = rest.map(row => {
      return this.header.reduce((prev, current, index) => {
        let value = undefined
        if (typeof row[index] === 'string') value = row[index].trim()
        if (!isNaN(row[index])) value = Number(row[index])
        return {
          ...prev,
          [`${current.trim()}`]: value
        }
      }, {})
    })

    const deleteBrackets = this.deleteBrackets(json)

    return this.getIfFirst() ? '[' + deleteBrackets : ', ' + deleteBrackets
  }

  /**
   * Returns separator type if it was passed explicitly
   * If not searches for the index of the separator in provided header
   * @param {string[]} row
   * @param {string | undefined} separatorType
   */
  setSeparator(header, separatorType = this.getSeparator()) {
    let separatorIndex = 0;

    if (!separatorType)
      separatorIndex = VALID_SEPARATORS.findIndex(separators => header.includes(separators))

    this.separator = separatorType ?? VALID_SEPARATORS[separatorIndex]
  }

  getSeparator() {
    return this.separator
  }

  setIfFirst() {
    this.checkIfFirst = false
  }

  getIfFirst() {
    return this.checkIfFirst
  }

  setUnprocessed(value) {
    this.unprocessed = value
  }

  getUnprocessed() {
    return this.unprocessed
  }
}