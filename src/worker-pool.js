import { GoogleSheets } from "../helper/GoogleSheets.js";
import { BrowserRunner } from "../helper/BrowserRunner.js";

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
