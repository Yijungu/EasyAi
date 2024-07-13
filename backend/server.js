require("dotenv").config();
const http = require("http");
const app = require("./app");
const { connectDB } = require("./utils/db");
const wss = require("./wsServer");

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    const server = http.createServer(app);

    server.on("upgrade", (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit("connection", ws, request);
      });
    });

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
