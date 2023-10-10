// require your server and launch it here
const server = require("./api/server.js");

const port = 3000;

server.listen(port, () => {
  console.log(`*** Server Running on http://localhost:${port} ***`);
});
