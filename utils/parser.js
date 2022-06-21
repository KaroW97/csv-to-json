const { getSeparatorType, VALID_SEPARATORS } = require("../utils/common")

class Parser {
  constructor() {
    this.checkIfFirst = true
    this.header = null
    this.separator = null
    this.firstParse = true
  }
  parseToJSON(chunk) {
    if (this.checkIfFirst) return
    const reduced = chunk.reduce((prev, current, index) => {
      let value = undefined
      if (typeof current === 'string') value = current.trim()
      if (!isNaN(current)) value = parseInt(current)

      return {
        ...prev,
        [`${this.header[index].trim()}`]: value
      }
    }, {})

    return reduced
  }
  getSeparator(chunk) {
    const separatorType = getSeparatorType()

    if (!separatorType) {
      const separatorIndex = VALID_SEPARATORS.findIndex(element => chunk.includes(element))
      this.separator = VALID_SEPARATORS[separatorIndex]
      return VALID_SEPARATORS[separatorIndex]
    }
    this.separator = separatorType
  }

  splitRow(chunk) {
    const splitted = chunk.split(this.separator)
    if (this.checkIfFirst) this.header = splitted
    return splitted
  }

  setIfFirst() {
    this.checkIfFirst = false
  }
  setFirstParse() {
    this.firstParse = false
  }
}


module.exports = {
  Parser
}