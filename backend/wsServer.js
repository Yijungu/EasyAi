const WebSocket = require("ws");
const wsController = require("./controllers/wsController");

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws, request) => {
  wsController.handleConnection(ws, request);
});

module.exports = wss;
