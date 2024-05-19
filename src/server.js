import { createServer } from "http";

const hostname = "127.0.0.1";
const port = 3030;

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

export const startServer = () => {
  server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
};


// INPUT_SPREADSHEET_ID=1jMAPx1I309BRcxkwj0GryZybv-DhfS983HoG4QMGNlE
// OUTPUT_SPREADSHEET_ID=1vfhXxdaXs54VgSvmpNEFAB4QW4SYfRICjuekFKZHh0A
// INPUT_SHEET_NAME=input_main_new
// OUTPUT_SHEET_NAME=output_main_new
// NUMBER_OF_DOMAINS_AT_A_TIME=10
// CONCURRENCY_LIMIT=10

// INPUT_SPREADSHEET_ID=placeholder_input_spreadsheet_id
// OUTPUT_SPREADSHEET_ID=placeholder_output_spreadsheet_id
// INPUT_SHEET_NAME=placeholder_input_sheet_name
// OUTPUT_SHEET_NAME=placeholder_output_sheet_name
// NUMBER_OF_DOMAINS_AT_A_TIME=placeholder_number_of_domains_at_a_time
// CONCURRENCY_LIMIT=placeholder_concurrency_limit

