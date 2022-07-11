const { Chance } = require('chance')
const chance = Chance()

/**
 * Function create array with random strings, then joins them into a string
 * @returns {string}
 */
const createRandomRow = () => {
  let tempArray = []

  for (let i = 0; i < 1e4; i++) {
    const date =
      chance.date({ string: true }) +
      ' ' +
      chance.date().toISOString().split('.')[0].split('T')[1]
    const address = chance.address()
    const district = chance.natural({ min: 1, max: 20 })
    const beat = district + chance.letter()
    const grid = chance.natural({ min: 1, max: 2000 })
    const crimedescr = chance.sentence()
    const ucr_ncic_code = chance.natural({ min: 2000, max: 3000 })
    const latitude = chance.latitude()
    const longitude = chance.longitude()

    tempArray.push(
      [
        date,
        address,
        district,
        beat,
        grid,
        crimedescr,
        ucr_ncic_code,
        latitude,
        longitude
      ]
        .join(', ')
        .toUpperCase() + '\r\n'
    )
  }
  return tempArray.join('')
}

process.on('message', (whenToClose) => {
  const response = createRandomRow()

  process.send(response)

  if (whenToClose === true) process.exit()
})
