const callFunction = process.argv.splice(2)[0]

if (callFunction.includes('csv-to-json')) require('./csvToJSON/csvParser')

if (callFunction.includes('random-big-file')) require('./bigFileCreator/bigFile')

if (callFunction.includes('save-google-drive')) require('./google/googleApi')
