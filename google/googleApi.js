const fs = require('fs')
require('dotenv').config()
const { google } = require('googleapis')
const { resolveError } = require('./innerErrors')
const { loggerSuccess } = require('../utils/logger')
const { GoogleAuth } = require('google-auth-library')
const { checkGoogleInputs } = require('../utils/validation')

const { KEY_FILE_PATH, SCOPE, GOOGLE_FILE_ID } = process.env

/**
 * Function creates inputs needed by google drive to upload data
 * @param {Record<string, string>} param0
 * @returns  Object with fields fileMetaData and media
 */
const createResources = ({ filePath, mimeType }) => {
  const fileName = filePath.split('/').splice(-1)

  let fileMetaData = {
    name: fileName,
    parents: [GOOGLE_FILE_ID]
  }

  let media = {
    mimeType,
    body: fs.createReadStream(filePath)
  }

  return { fileMetaData, media }
}

/**
 * Authorize user
 * @returns {GoogleApis}
 */
const authorize = () => {
  const auth = new GoogleAuth({
    scopes: [SCOPE],
    keyFile: KEY_FILE_PATH
  })

  return google.drive({ version: 'v3', auth })
}

/**
 * Core function, manages the flow in module. Receives data provided by user
 * Then tries to do the authorization. Tries to access a file
 * And then creates file in the google drive.
 */
;(async () => {
  try {
    console.time('TEST')
    const googleInputs = (await checkGoogleInputs()) || {}

    const service = authorize()

    const { fileMetaData, media } = createResources(googleInputs)

    await service.files.create({
      resource: fileMetaData,
      media: media,
      fields: 'id'
    })

    const fileId = await service.files.get({ fileId: fileMetaData.parents[0] })

    loggerSuccess(fileId.data.name)
    console.timeEnd('TEST')
  } catch (err) {
    resolveError(err)
  }
})()
