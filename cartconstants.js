import dotenv from "dotenv";
dotenv.config();
import fs from 'fs';

const loadConstants = () => {

  const jsonData = fs.readFileSync('links.json', 'utf8');

  const { link1Data, link2Data } = JSON.parse(jsonData);

  const CART_BRANDS_MAP = [
    {
      name: "slidecart",
      url: "slidecarthq3",
    },
    {
      name: "cornercart",
      url: "cornercart.io",
    },
    {
      name: "icart",
      url: "icart-dev",
    },
    {
      name: "upcart",
      url: "upcart",
    },
    {
      name: "Monstercart",
      url: "Monsterapps-beta",
    },
  ];

  const SHEETS_DETAILS = {
    HEADER: [
      "site_url",
      ...CART_BRANDS_MAP.map((obj) => obj.url),
      "last_updated_at",
    ],
    INPUT_SPREADSHEET_ID: link1Data,
    OUTPUT_SPREADSHEET_ID: link2Data,
    INPUT_SHEET_NAME: process.env.INPUT_SHEET_NAME_CART,
    OUTPUT_SHEET_NAME: process.env.OUTPUT_SHEET_NAME_CART,
  };

  const STRING_CONSTANTS = {
    YES: "yes",
    NO: "no",
    NOT_FOUND: "not found",
    YES_LIVE: "yes (live)",
    YES_PAUSED: "yes (paused)",
  };

  return { CART_BRANDS_MAP, SHEETS_DETAILS, STRING_CONSTANTS };

};

export default loadConstants;
