const fs = require('fs');

exports.readFile = async (filePath) => (await fs.promises.readFile(filePath)).toString()