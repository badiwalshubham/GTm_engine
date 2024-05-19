import plimit from "p-limit";
import GSheets  from "../helper/GoogleSheets.js";
import { BrowserRunner } from "../helper/BrowserRunner.js";
import Piscina from "piscina";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import readline from 'readline';
import { get } from "http";
import fs from 'fs';
import loadConstants from "../constants.js";
dotenv.config();

const { GoogleSheets } = GSheets();

const Reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


let link1Data, link2Data;
// let link1Data, link2Data, inputSheetName, outputSheetName;

  const getInputLinks = () => {
  return new Promise((resolve, reject) => {
    Reader.question("Enter the Input spreadsheet ID: ", link1 => {
      link1Data = link1;
      resolve();
    });
  });
};

  const getOutputLinks = () => {
  return new Promise((resolve, reject) => {
    Reader.question("Enter the Output spreadsheet ID: ", link2 => {
      link2Data = link2;
      resolve();
    });
  });
};


const runInputLinks = async () => {
  await getInputLinks();
  await getOutputLinks();
 
    // ================== Store the links in JSON and then use it==================

  const data = {
    link1Data,
    link2Data
  };

  // Convert the object to JSON format
  const jsonData = JSON.stringify(data, null, 2); 

  // Write JSON data to a file
  fs.writeFileSync('links.json', jsonData);

  console.log("Input and output ID captured successfully.");
  console.log('Current Input and output links are saved');
  Reader.close();


  // ==================  Update the env using differnt methods ==================
  // const askQuestion = (query) => {
  //   return new Promise((resolve) => {
  //     Reader.question(query, resolve);
  //   });
  // };
  
  // const runInputLinks = async () => {
  //   link1Data = await askQuestion("Enter the Input spreadsheet link: ");
  //   link2Data = await askQuestion("Enter the Output spreadsheet link: ");
  //   inputSheetName = await askQuestion("Enter the Input sheet name: ");
  //   outputSheetName = await askQuestion("Enter the Output sheet name: ");
    
  //   console.log("Input and output links captured successfully.");
  //   Reader.close();
  
  //   process.env.INPUT_SPREADSHEET_ID = link1Data;
  //   process.env.OUTPUT_SPREADSHEET_ID = link2Data;
  //   process.env.INPUT_SHEET_NAME = inputSheetName;
  //   process.env.OUTPUT_SHEET_NAME = outputSheetName;

 // ==================  Update the .env file ==================

//   process.env.INPUT_SPREADSHEET_ID = link1Data;
//   process.env.OUTPUT_SPREADSHEET_ID = link2Data;

//  // Convert the environment variables object to a string
// const envData = Object.keys(process.env)
// .map(key => `${key}=${process.env[key]}`)
// .join('\n');

// // Write the changes back to the .env file
// fs.writeFileSync('.env', envData);

// console.log('.env file updated successfully');

  
  // Call the main function after the links are captured
  // main(); 
  loadConstants();
  GSheets();
  setTimeout(() => {
    main();
  }, 10000);

};

const TASK_COMPLETED = "TASK-COMPLETED";

const CONSTANTS = {
  NUMBER_OF_DOMAINS_AT_A_TIME: parseInt(process.env.NUMBER_OF_DOMAINS_AT_A_TIME),
  CONCURRENCY_LIMIT: parseInt(process.env.CONCURRENCY_LIMIT),
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const piscina = new Piscina({
  filename: path.resolve(__dirname, "worker-pool.js"),
});

const main = async () => {
  let startTime = new Date().getTime();

  let startIndex = parseInt(process.env.START_ROW) || 2;

  let totalRows = parseInt(process.env.TOTAL_ROWS) || await GoogleSheets.getTotalRows();

  console.log("totalRows", totalRows);
  let promises = [];

  for (
    let currentIndex = startIndex;
    currentIndex <= totalRows;
    currentIndex += CONSTANTS.NUMBER_OF_DOMAINS_AT_A_TIME + 1
  ) {
    let response = piscina.run({
      startIndex: currentIndex,
      endIndex: currentIndex + CONSTANTS.NUMBER_OF_DOMAINS_AT_A_TIME,
      totalRows,
    });
    promises.push(response);
  }

  console.log("total promises =>", promises.length);

  let output = await Promise.all(promises);

  console.log("######## all done ########", output);

  let endTime = new Date().getTime();
  console.log(
    "time taken => ",
    Math.round((endTime - startTime) / (1000 * 60), 2),
    "mins for",
    totalRows - startIndex + 1,
    "domains"
  );
  console.log(TASK_COMPLETED);
};

runInputLinks();
// loadConstants();
//   GSheets();


