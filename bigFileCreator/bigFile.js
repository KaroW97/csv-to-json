const fs = require('fs');
const FILE_NAME = 'testData/testBig.csv'
const { fork } = require('child_process');
let transformedData = fs.createWriteStream(FILE_NAME, { flags: 'a' })

let child = fork('bigFileCreator/child')
child.setMaxListeners(40)
const callChild = async () => {
  child.send('start')
  return new Promise(resolve => {
    child.on('message', async (data) => resolve(data))
  })
}

async function write() {
  console.time('TEST');
  for (let i = 0; i < 1e6; i++) {
    const data = await callChild()

    const ableToWrite = transformedData.write(data);
    if (!ableToWrite) {
      await new Promise(resolve => {
        transformedData.once('drain', resolve);
      });
    }
    const size = (await fs.promises.stat(FILE_NAME)).size
    if ((size / 1e6) > 10000)
      break;
    if (child.listenerCount('message') === child.getMaxListeners()) {
      child.send(true)
      child = fork('bigFileCreator/child')
    }
  }
  console.timeEnd('TEST');
  console.log('JESTE,');
  child.send(true)
}


(async () => {
  transformedData.write('cdatetime, address, district, beat, grid, crimedescr, ucr_ncic_code, latitude, longitude' + '\r\n')
  await write()
})()
