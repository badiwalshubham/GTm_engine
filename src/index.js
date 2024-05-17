import { GoogleSheets } from "../helper/GoogleSheets.js";
import { BrowserRunner } from "../helper/BrowserRunner.js";
import Piscina from "piscina";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

// For taking the Input links!
const readline = require('readline');

const Reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let link1Data, link2Data;

const getInputLinks = () => {
    return new Promise((resolve, reject) => {
        Reader.question("Enter the Input spreadsheet link : ", link1 => {
            link1Data = link1;
            resolve();
        });
    });
};

const getOutputLinks = () => {
    return new Promise((resolve, reject) => {
        Reader.question("Enter the Output spreadsheet link : ", link2 => {
            link2Data = link2;
            resolve();
        });
    });
};

const exportData = () => {
    return { link1: link1Data, link2: link2Data };
};

const runInputLinks = async () => {
    await getInputLinks();
    await getOutputLinks();

    console.log("Input and output links captured successfully.");
    Reader.close();

    // Call the main function after capturing input links
    main();
};

// Export Reader, getInputLinks, and getOutputLinks along with other components

export { Reader, getInputLinks, getOutputLinks, exportData };



// ---Inputlinks_code---- (Moved to the end after input link setup)
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

// Call runInputLinks to start the process
runInputLinks();
