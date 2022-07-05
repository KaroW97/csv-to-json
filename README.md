# Installation

```
npm i csv-json-parser-module
```

# Development env

To invoke any module from **scripts** in package.json set

```
set NODE_ENV=development && node node_modules/csv-json-parser-module/FOLDER_NAME/FILE_NAME
```
then you can call module from the terminal with `npm run SCRIPT_NAME` command.

| FOLDER_NAME   | main FILE_NAME | description
| ------------- | ------------- | -------- |
| bigFileCreator | bigFile       | Creates file   |
| csvToJSON     | csvParser            | Parse file from csv to json   |
| google| googleApi| Uploads file to google drive|

**IMPORTANT** All field names apply to dev mode as well



# Production env
## Creating random csv file

Function creates random CSV file. **Remember** the size is approximate

## Example invocation:
###### __file name index.js__
```
const parser = require('csv-json-parser-module');

parser.bigFile(process.argv);
```
**process.argv** is required as the params are taken from the terminal

Then you can call it in the terminal with:

```
node index filePath="FILE_PATH" size=SIZE
```

FILE_PATH is a place where you want to create CSV


### Valid parameters

When passing the file path remember about commas around. Else it maybe split and cause error message

**Size is considered in GB. If you want less take it under consideration**

| value name    | example value | type     | isOptional| default value|
| ------------- | ------------- | -------- |--------  |--------|
| filePath      | NAME.csv       | string   |  true    |**C:/Users/YOUR_USER_NAME/Desktop/randomFile.csv**|
| size          | 0.1            | number   |  true    | 10GB|


------

## Parse CSV to JSON
It is used to parse csv data to json. Program is not working in revers

### Valid Parameters

When  **separator** not passed its automatically searched. Basing on the first line e.g. **header**

| value name    | example value         | type     | valid value/ extension | isOptional
| ------------- | -------------         | -------- |  --------              | --------  |
| --sourceFile  | "./testData/test.csv" | string   | **.csv**               | false     |
| --resultFile  | "./testData/test.json"| string   | **.json**              | false     |
| --separator   | ","                   | string   | **['   ', ',', ';']**  | true      |

### Example invocation:
###### __file name index.js__
```
const parser = require('csv-json-parser-module');

(async () => {
  await parser.csvParser(process.argv)
  process.exit()
})();
```
The process needs to be stopped explicitly else it won't break by itself

### Example Calls

```
node index --sourceFile "YOUR_INPUT" --resultFile "YOUR_OUTPUT" --separator "SEPARATOR"
node index --sourceFile "YOUR_INPUT" --resultFile "YOUR_OUTPUT"
```

---
## Google Upload

### Before running:

1. Create .env file, and insert:
  ```
  SCOPE = 'https://www.googleapis.com/auth/drive'
  KEY_FILE_PATH = "./google/credentials/csv-to-json.json"
  GOOGLE_FILE_ID = "GOOGLE_FILE_ID"
  ```
To get **YOUR_GOOGLE_FILE_ID** go to chosen directory in google drive and then take the part of url after folders/...

```
https://drive.google.com/drive/u/0/folders/YOUR_GOOGLE_FILE_ID
```

2. Go under this link https://developers.google.com/drive/api/quickstart/nodejs and follow the **Prerequisites** instructions

3. When received credentials paste it in chosen directory and pass path to **KEY_FILE_PATH**. **Remember** to get them as JSON file




### Valid Parameters

| value name    | example value         | type     | Extension   | isOptional
| ------------- | -------------         | -------- |  --------                | --------  |
| filePath      | "./testData/test.csv" | string   | **.csv**, **.json**      | false     |

### Example invocation:
###### __file name index.js__
```
const parser = require('csv-json-parser-module');

(async () => {
  await parser.googleApi(process.argv)
  process.exit()
})();
```
The process needs to be stopped explicitly else it won't break by itself


### Example Calls

```
node index filePath="YOUR_FILE_PATH"
```
**REMEMBER** Calls are just an example you can define them in scripts as well