import GSheets from "../helper/CheckoutGoogleSheets.js";
import Piscina from "piscina";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import readline from 'readline';
import fs from 'fs';
import loadConstants from "../checkoutconstants.js";
dotenv.config();

const { GoogleSheets } = GSheets();

const Reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


let link1Data, link2Data;

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
  process.argv[2]; 
  if (process.argv[2] !== 'cart' && process.argv[2] !== 'checkout') {
    console.error("Error: Invalid argument. Use 'cart' or 'checkout'.");
    process.exit(1);
  }
  console.log("You Choose the", process.argv[2] );

  await getInputLinks();
  await getOutputLinks();


  const data = {
    link1Data,
    link2Data
  };

  const jsonData = JSON.stringify(data, null, 2);

  fs.writeFileSync('links.json', jsonData);

  console.log("Input and output ID captured successfully.");
  console.log('Current Input and output links are saved');
  Reader.close();

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
  filename: path.resolve(__dirname, "checkoutworker-pool.js"),
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


