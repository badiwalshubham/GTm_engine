import GSheets from "../helper/CartGoogleSheets.js";
import { BrowserRunner } from "../helper/CartBrowserRunner.js";

const { GoogleSheets } = GSheets();

export default async (input) => {
  let { startIndex, endIndex, totalRows } = input;
  if (endIndex > totalRows) endIndex = totalRows;
  console.log("startIndex", startIndex, "endIndex", endIndex);

  let rows = await GoogleSheets.getDomains(
    startIndex,
    endIndex
  );
  if (rows.length <= 0) return [];

  const data = await BrowserRunner.getCheckoutBrandForMultipleDomain(rows);

  await GoogleSheets.updateDataTOGoogleSheet(
    data,
    startIndex + 1,
    endIndex + 1
  );
  return { startIndex, endIndex };
};
