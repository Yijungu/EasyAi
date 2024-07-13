// backend/controllers/wsController.js
const memory = require("../utils/memory");
const { joinTeam, leaveTeam, createTeam } = require("../services/teamService");
const {
  sendToUser,
  broadcastMessage,
  broadcastMessageIn,
} = require("../services/userService");

exports.handleConnection = (ws, request) => {
  const urlParts = request.url.split("/");
  const schoolId = urlParts[2];
  const userNickName = urlParts[3];
  const school = memory[schoolId];

  if (!school) {
    console.error(`School with ID ${schoolId} not found in memory.`);
    ws.close();
    return;
  }
  let user = school.users.find((user) => user.nickname == userNickName);

  user.websocket = ws;

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    exports.handleMessage(school, user.id, data);
  });

  ws.on("close", () => {
    exports.handleClose(school, user.id);
  });

  ws.on("error", (error) => {
    console.error(`WebSocket error: ${error.message}`);
    exports.handleClose(school, user.id);
  });
};

exports.handleMessage = (school, userId, data) => {
  switch (data.type) {
    case "setMode":
      setMode(school, data.mode);
      break;
    case "createTeam":
      createTeam(school, data.teams);
      break;
    case "joinTeam":
      joinTeam(school, userId, data.teamId);
      break;
    case "leaveTeam":
      leaveTeam(school, userId, data.teamId);
      break;
    case "offer":
    case "answer":
    case "candidate":
      sendToUser(school, data.targetType, data);
      break;
    case "shareScreen":
      handleShareScreen(school, userId, data);
      break;
    case "stopShareScreen":
      handleStopShareScreen(school, userId, data);
      break;
    default:
      break;
  }
};

exports.handleClose = (school, userId) => {
  const index = school.users.findIndex((u) => u.id == userId);
  if (index !== -1) {
    school.users[index].websocket = null;
  }
  Object.keys(school.teams).forEach((teamId) =>
    leaveTeam(school, userId, teamId)
  );
};

function setMode(school, mode) {
  school.currentMode = mode;

  if (mode === "personal") {
    const teacher = school.users.find((user) => user.nickname === "teacher");

    school.users.forEach((user) => {
      if (user.nickname !== "teacher") {
        user.screenOwner = "selfScreen";
        sendToUser(school, user.id, {
          type: "mode",
          mode: "personal",
          sharing: false,
        });
      }
    });
    if (teacher) {
      sendToUser(school, teacher.id, {
        type: "mode",
        mode: "manage",
        sharing: false,
        users: school.users
          .filter((user) => user.nickname !== "teacher")
          .map((user) => ({
            id: user.id,
            nickname: user.nickname,
          })),
      });
    }
  } else if (mode === "team") {
    school.teams.forEach((team) => {
      const teamLeader = school.users.find((user) => user.id === team.leaderId);
      team.members.forEach((memberId) => {
        const member = school.users.find((user) => user.id === memberId);
        if (member) {
          member.screenOwner = team.leaderId;
          sendToUser(school, member.id, {
            type: "mode",
            mode: "shared",
            sharing: false,
          });
        }
      });
      if (teamLeader) {
        teamLeader.screenOwner = "selfScreen";
        sendToUser(school, teamLeader.id, {
          type: "mode",
          mode: "personal",
          sharing: true,
          targetId: "team",
        });
      }
    });
    const teacher = school.users.find((user) => user.nickname === "teacher");
    if (teacher) {
      sendToUser(school, teacher.id, {
        type: "mode",
        mode: "manage",
        sharing: false,
        teams: school.teams,
      });
    }
  } else if (mode === "teacher") {
    const teacher = school.users.find((user) => user.nickname === "teacher");
    if (teacher) {
      sendToUser(school, teacher.id, {
        type: "mode",
        mode: "personal",
        sharing: true,
        targetId: "everyone",
      });
      school.users.forEach((user) => {
        if (user.id !== teacher.id) {
          user.screenOwner = "teacher";
          sendToUser(school, user.id, {
            type: "mode",
            mode: "shared",
            sharing: false,
          });
        }
      });
    }
  }
}

function handleShareScreen(school, userId, data) {
  const message = {
    type: "screenShare",
    image: data.image,
    from: userId,
  };
  if (data.targetType === "everyone") {
    broadcastMessage(school, message, [userId]);
  } else if (data.targetType === "teacherAndOthers") {
    const targets = school.users
      .filter((user) => user.id !== userId && user.nickname !== "teacher")
      .map((user) => user.id);
    broadcastMessage(school, message, targets);
  } else if (data.targetType === "specific") {
    const targets = data.targetType;
    broadcastMessageIn(school, message, targets);
  } else if (data.targetType === "team") {
    team_user = school.users.find((user) => user.id == userId);
    const teamId = team_user.teamId;
    const teamMembers = school.teams[teamId - 1].members || [];
    const targets = teamMembers.filter((id) => id !== userId);
    console.log("teamMembers : ", teamMembers);
    console.log("targets : ", targets);
    broadcastMessageIn(school, message, targets);
  }
}

function handleStopShareScreen(school, userId, data) {
  const message = {
    type: "stopScreenShare",
    from: userId,
  };

  if (data.targetType === "everyone") {
    broadcastMessage(school, message, [userId]);
  } else if (data.targetType === "teacherAndOthers") {
    const targets = school.users
      .filter((user) => user.id !== userId && user.nickname !== "teacher")
      .map((user) => user.id);
    broadcastMessage(school, message, targets);
  } else if (data.targetType === "specific") {
    const targets = data.targetIds;
    broadcastMessage(school, message, targets);
  } else if (data.targetType === "team") {
    const teamId = data.teamId;
    const teamMembers = school.teams[teamId] || [];
    const targets = teamMembers.filter((id) => id !== userId);
    broadcastMessage(school, message, targets);
  }
}
