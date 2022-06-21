const { transformToJSON } = require('./handlers/parentProcessFile')
const { validation } = require('./utils/validation')

const main = async () => {
  try {
    validation()
    transformToJSON()
  } catch (error) {
    console.error(error)
  }

}
console.time('READING')
main()
console.timeEnd('READING')