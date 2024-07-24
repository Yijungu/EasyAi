const WebSocket = require("ws");

function sendToUser(school, targetId, message) {
  const targetUser = school.users.find((user) => user.id == targetId);
  // console.log(message.type, targetId);
  // console.log(school.users);
  // console.log("targetUser: ", targetUser.nickname, targetUser.id);

  if (
    targetUser &&
    targetUser.websocket &&
    targetUser.websocket.readyState === WebSocket.OPEN
  ) {
    targetUser.websocket.send(JSON.stringify(message));
  }
}

function broadcastMessage(school, message, excludeIds = []) {
  school.users.forEach((user) => {
    if (
      !excludeIds.includes(user.id) &&
      user.websocket &&
      user.websocket.readyState === WebSocket.OPEN
    ) {
      user.websocket.send(JSON.stringify(message));
    }
  });
}

function broadcastMessageIn(school, message, includeIds = []) {
  school.users.forEach((user) => {
    if (
      includeIds.includes(user.id) &&
      user.websocket &&
      user.websocket.readyState === WebSocket.OPEN
    ) {
      user.websocket.send(JSON.stringify(message));
    }
  });
}

module.exports = {
  sendToUser,
  broadcastMessage,
  broadcastMessageIn,
};
