import { google } from "googleapis";
import { SHEETS_DETAILS } from "../constants.js";
import dotenv from "dotenv";
// import { getInputLinks } from "../src/index.js";
dotenv.config();
import { exportData } from '../src/index.js'; // replace with the path to your file


// const exportData = function() {
//   return {link1};
// };

const { link1: INPUT_SPREADSHEET_ID, link2: OUTPUT_SPREADSHEET_ID } = exportData();

const CONSTANTS = {
  // INPUT_SPREADSHEET_ID: process.env.INPUT_SPREADSHEET_ID,
  INPUT_SPREADSHEET_ID: INPUT_SPREADSHEET_ID,
  INPUT_SHEET_NAME: process.env.INPUT_SHEET_NAME,
};


export class GoogleSheets {
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
