import puppeteer from "puppeteer";
import loadConstants from "../checkoutconstants.js";
const { CART_BRANDS_MAP, STRING_CONSTANTS } = loadConstants();

export class BrowserRunner {
  static async getCheckoutBrandForMultipleDomain(rows, verbose = false) {
    try {
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setRequestInterception(true);

      let responses = rows.map((row) => [
        row[0],
        ...CART_BRANDS_MAP.map((_) => STRING_CONSTANTS.NO),
        new Date().toLocaleString(),
      ]);

      page.on("request", (request) => {
        const requestUrl = request.url();

        responses = BrowserRunner.getCheckout(
          verbose,
          requestUrl,
          responses,
          page.url()
        );

        request.continue();
      });

      for (let index = 0; index < rows.length; index++) {
        let row = rows[index];
        let domain = row[0];
        try {
          // if (row[1] === CONSTANTS.NOT_FOUND) {
          if (verbose) {
            console.log(index, ". opening", domain);
            console.log(
              "======================================================="
            );
          }
          let res = await page.goto(
            `https://${domain.replace("https://", "")}`,
            {
              timeout: 120000,
            }
          );

          CART_BRANDS_MAP.map((brand, i) => {
            if (brand.live_url && responses[index][i + 1] === STRING_CONSTANTS.YES)
              responses[index][i + 1] = STRING_CONSTANTS.YES_PAUSED;
          });

          if (verbose)
            console.log(
              "++++++++++++++++++++++++++++++++++++++++++++++++++++++++++",
              res
            );
          // } else responses[index] = row;
        } catch (e) {
          let notFoundUrls = responses.filter(
            (response) => response[0] === domain
          );
          if (notFoundUrls.length > 0) {
            console.log(index, ". error while opening", domain, "\n", e);
            notFoundUrls[0] = notFoundUrls[0].map((url, i) =>
              i !== 0 ? STRING_CONSTANTS.NOT_FOUND : url
            );
            responses[index] = notFoundUrls[0];
          } else {
            console.log("Logic Not Working for", domain);
          }
        }
      }
      await browser.close();
      return responses;
    } catch (error) {
      console.log("error in getCheckoutBrandForMultipleDomain =>\n", error);
    }
  }

  static getCheckout(verbose, requestUrl, responses, pageUrl) {
    let merchantBrands = responses.filter(
      (response) =>
        response[0]
          .replace("https://", "")
          .replace("www.", "")
          .replace("/", "") ===
        pageUrl.replace("https://", "").replace("www.", "").replace("/", "")
    );

    if (merchantBrands.length == 0) {
      console.log("no url matching with page url", pageUrl);
      return responses;
    }

    let index = responses.findIndex(
      (response) => response[0] === merchantBrands[0][0]
    );

    CART_BRANDS_MAP.forEach((brand, i) => {
      if (brand.url && requestUrl.includes(brand.url)) {
        if (verbose) console.log(requestUrl);

        if (responses[index][i + 1] === STRING_CONSTANTS.YES_PAUSED)
          responses[index][i + 1] = STRING_CONSTANTS.YES_PAUSED;
        else if (
          responses[index][i + 1] === STRING_CONSTANTS.YES_LIVE ||
          (brand.live_url && requestUrl.includes(brand.live_url))
        )
          responses[index][i + 1] = STRING_CONSTANTS.YES_LIVE;
        else responses[index][i + 1] = STRING_CONSTANTS.YES;
      }
    });

    return responses;
  }
}

