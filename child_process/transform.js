const { Transform } = require("stream");
const { Parser } = require("../utils/parser");
const parser = new Parser()

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
    if (parser.checkIfFirst) {
      parser.getSeparator(chunk)
      parser.splitRow(chunk)
    }
    const row = parser.splitRow(chunk)

    const toJson = parser.parseToJSON(row)

    let parsed = parser.checkIfFirst ? '[' : JSON.stringify(toJson)

    if (!parser.firstParse) parsed = ',' + parsed
    if (!parser.checkIfFirst) parser.setFirstParse()

    parser.setIfFirst()

    callback(null, parsed)
  }
});