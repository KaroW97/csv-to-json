const { Transform } = require("stream");
const { getSeparatorType } = require("../utils/common");
const {
  createTempObject,
  parseToJSON,
  getHeaders,
  checkSeparator,
  splitToRows
} = require("../utils/parser");

let checkIfFirst = true
let separator = undefined, header = undefined, chunkLength = undefined
let checkIfEOL = true
let storeRecordBegin = '', storeRecordEnd = '', lastChunk = ''

const modifyArray = (array, EOLvalue) => EOLvalue ? array.pop() : array.shift()

const findUnfinishedChunks = (row, byteLength) => {
  if (!row.every(element => element.endsWith('\r'))) {

    if (!row[row.length - 1].endsWith('\r') && !(byteLength < chunkLength))
      storeRecordBegin += modifyArray(row, checkIfEOL)
    console.log(row);
    if (row[0].endsWith('\r') && !checkIfFirst)
      storeRecordEnd += modifyArray(row, !checkIfEOL)

    if (byteLength < chunkLength) {
      lastChunk += modifyArray(row, !checkIfEOL)
    }

    checkIfEOL = !checkIfEOL
  }
}

const addUnfinishedChunks = (row, byteLength) => {
  if (!checkIfEOL && storeRecordEnd.length) {
    row.push(storeRecordEnd)
    console.log('storeRecordEnd....', storeRecordEnd);
    storeRecordEnd = ''
  }
  if (checkIfEOL) {
    row.unshift(storeRecordBegin)
    console.log('storeRecordBegin....', storeRecordBegin);
    storeRecordBegin = ''
  }
  console.log(byteLength < chunkLength);
  console.log(lastChunk);
  if (byteLength < chunkLength)
    row.push(lastChunk)

}
exports.transform = new Transform({
  writableObjectMode: true,
  readableObjectMode: true,
  /**
   *
   * @param {Buffer} chunk
   * @param {*} encoding
   * @param {*} callback
   */
  transform(chunk, encoding, callback) {
    const chunkString = chunk.toString()
    console.log(chunkString);
    const byteLength = Buffer.byteLength(chunk)
    let row = splitToRows(chunkString)

    if (checkIfFirst) {
      separator = checkSeparator(row, getSeparatorType())
      header = getHeaders(row, separator)
      chunkLength = byteLength
    }

    findUnfinishedChunks(row, byteLength)

    addUnfinishedChunks(row, byteLength)

    const tempObject = createTempObject(checkIfFirst ? row.splice(1) : row, separator)

    const parsed = parseToJSON({ header, ...tempObject }, separator)

    const deleteBrackets = JSON.stringify(parsed).replace(/[\[\]']+/g, '')

    const stringify = checkIfFirst ? deleteBrackets : ', ' + deleteBrackets

    checkIfFirst = false

    callback(null, stringify);
  },

  flush(callback) {
    callback(null, "\n]")
  }

});