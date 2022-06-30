if (process.title.includes('csv-to-json')) require('./csvToJSON/csvParser')

if (process.title === 'random-big-file') require('./bigFileCreator/bigFile')

if (process.title === 'save-google-drive') require('./google/googleApi')
