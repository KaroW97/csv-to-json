const { transformToJSON } = require('./handlers/parentProcessFile')
const { validation } = require('./utils/validation')

const main = async () => {
  console.time('READING')
  try {
    validation()

    await transformToJSON()


  } catch (error) {
    console.error(error)
  }
  console.timeEnd('READING')
}

main()
