# csv-to-json

## Creating random csv file

Function creates random CSV file. **Remember** the size is approximate

### Basic Call
```
 npm run random-big-file
```

### Valid parameters

**Size is considered in GB. If you want less take it under consideration**

| value name    | example value | type     | isOptional|
| ------------- | ------------- | -------- |--------  |
| filePath      | big.csv       | string   |  true    |
| size          | 10            | number   |  true    |


### Example calls

When passing the file path remember about commas

When file name not passed, the file will be saved by default under:
 **C:/Users/YOUR_USER_NAME/Desktop/randomFile.csv**

Default file size is **10GB**
```
 npm run random-big-file fileName="YOUR_FILE"
 npm run random-big-file fileName="YOUR_FILE" size=YOUR_SIZE
 npm run random-big-file size=YOUR_SIZE
```


---
## Parse CSV to JSON
It is used to parse csv data to json. Program is not working in revers

### Valid Parameters

When  **separator** not passed its automatically searched. Basing on the first line e.g. **header**

| value name    | example value         | type     | valid value/ extension | isOptional
| ------------- | -------------         | -------- |  --------              | --------  |
| --sourceFile  | "./testData/test.csv" | string   | **.csv**               | false     |
| --resultFile  | "./testData/test.json"| string   | **.json**              | false     |
| --separator   | ","                   | string   | **['   ', ',', ';']**  | true      |

### Example Calls

```
npm run csv-to-json -- --sourceFile "YOUR_INPUT" --resultFile "YOUR_OUTPUT" --separator "SEPARATOR"
npm run csv-to-json -- --sourceFile "YOUR_INPUT" --resultFile "YOUR_OUTPUT"
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
To get **YOUR_GOOGLE_FILE_ID** go to chosen directory in google drive and then take the part of url after folders/**YOUR_GOOGLE_FILE_ID**

```
https://drive.google.com/drive/u/0/folders/YOUR_GOOGLE_FILE_ID
```

2. Go under this link https://developers.google.com/drive/api/quickstart/nodejs and follow the **Prerequisites** instructions

3. When received credentials paste it in chosen directory and pass path to **KEY_FILE_PATH**. **Remember** to get them as JSON file




### Valid Parameters

| value name    | example value         | type     | Extension   | isOptional
| ------------- | -------------         | -------- |  --------                | --------  |
| filePath      | "./testData/test.csv" | string   | **.csv**, **.json**      | false     |

### Example Calls
```
npm run save-google-drive filePath="YOUR_FILE_PATH"
```