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

// Input Sheet ID=172kp5NxF6UbqJ8MMvZJ0wY9PhzHYp4p0POH3Gi5U3SM
// Output Sheet ID =1N3fw2rlxYyC_cEVuxaNFB5g6xvGACXs1fEJ_e7wvg1k



