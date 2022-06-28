const fs = require('fs');
require('dotenv').config();
const { google } = require('googleapis');
const { loggerSuccess } = require('./logger');
const { checkIfExists } = require('../utils/common');
const { GoogleAuth } = require('google-auth-library');
const { FileError, resolveError } = require('./error');

const { KEY_FILE_PATH, SCOPE } = process.env;

const createResources = (filePath) => {

  const fileSplit = filePath.split('/')

  const fileName = fileSplit[fileSplit.length - 1]

  let fileMetaData = {
    'name': fileName,
    'parents': ['1Vc9bighvMvkJm6O-a4OsEBzd_8qxDTcf']
  }
  let media = {
    mimeType: 'text/csv',
    body: fs.createReadStream(filePath),
  }
  return {
    fileMetaData,
    media
  }
}

const authorize = () => {
  const auth = new GoogleAuth({
    scopes: [SCOPE],
    keyFile: KEY_FILE_PATH,
  })

  return google.drive({ version: 'v3', auth });
}

(async () => {
  const filePath = process.argv.slice(2)[0]

  const service = authorize()

  try {
    const check = await checkIfExists(filePath)

    if (!check) throw new FileError(filePath)

    const { fileMetaData, media } = createResources(filePath)

    const file = await service.files.create({
      resource: fileMetaData,
      media: media,
      fields: 'id',
    })

    const fileId = await service.files.get({ fileId: fileMetaData.parents[0] });

    loggerSuccess(file.status, fileId.data.name)

  } catch (err) {

    resolveError(err)
  }
})()