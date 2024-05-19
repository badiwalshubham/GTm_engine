import { google } from "googleapis";
import  loadConstants   from "../constants.js";
import dotenv from "dotenv";
dotenv.config();
import fs from 'fs';
// import fs from 'fs/promises';

const { CHECKOUT_BRANDS_MAP, SHEETS_DETAILS, STRING_CONSTANTS } = loadConstants();

// const GSheets = async () => {
 const GSheets = () => {
  
// Read the content of the links.json file
const jsonData = fs.readFileSync('links.json', 'utf8');
// const jsonData = await fs.readFile('links.json', 'utf8');

// Parse the JSON content to extract link1Data and link2Data
const { link1Data, link2Data } = JSON.parse(jsonData);

const CONSTANTS = {
  INPUT_SPREADSHEET_ID: link1Data,
  INPUT_SHEET_NAME: process.env.INPUT_SHEET_NAME,
};

class GoogleSheets {
  static async getInstance() {
    const auth = new google.auth.GoogleAuth({
      keyFile: "googleSheetsCreds.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const authClientObject = await auth.getClient();

    const googleSheetsInstance = google.sheets({
      version: "v4",
      auth: authClientObject,
    });
    console.log("######## connection made to google sheets ########\n\n");
    return { googleSheetsInstance, auth };
  }

  static async getDomains(startIndex, endIndex) {
    try {
      const { googleSheetsInstance, auth } = await this.getInstance();
      const response = await googleSheetsInstance.spreadsheets.values.get({
        auth,
        spreadsheetId: SHEETS_DETAILS.INPUT_SPREADSHEET_ID,
        range: `'${SHEETS_DETAILS.INPUT_SHEET_NAME}'!${startIndex}:${endIndex}`,
      });
      let sheetData = response.data.values;

      let domains = [];

      if (!sheetData || sheetData.length <= 0) return domains;

      sheetData.forEach((row) => {
        if (row && row.length > 0) domains.push(row);
      });
      return domains;
    } catch (error) {
      console.log(
        "couldn't get domains for",
        startIndex,
        "-",
        endIndex,
        "\n",
        error
      );
    }
  }

  static async updateDataTOGoogleSheet(data, rowsStartIndex, rowsEndIndex) {
    try {
      const { googleSheetsInstance, auth } = await this.getInstance();
      const response = await googleSheetsInstance.spreadsheets.values.update({
        auth,
        spreadsheetId: SHEETS_DETAILS.OUTPUT_SPREADSHEET_ID,
        range: `'${SHEETS_DETAILS.OUTPUT_SHEET_NAME}'!${rowsStartIndex}:${rowsEndIndex}`,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: data,
        },
      });
      return response;
    } catch (error) {
      console.log("couldn't update data to google sheet\n", error);
    }
  }

  static async getTotalRows() {
    try {
      const { googleSheetsInstance, auth } = await this.getInstance();
      console.log(SHEETS_DETAILS.INPUT_SPREADSHEET_ID, SHEETS_DETAILS.INPUT_SHEET_NAME)
      const response = await googleSheetsInstance.spreadsheets.values.get({
        auth,
        spreadsheetId: CONSTANTS.INPUT_SPREADSHEET_ID,
        range: CONSTANTS.INPUT_SHEET_NAME,
      });
      return response.data.values.length;
    } catch (error) {
      console.log("error in getTotalRows =>\n", error);
    }
  }
}

return { GoogleSheets, CONSTANTS };

};

export default GSheets;
