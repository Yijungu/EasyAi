const memory = require("../utils/memory");
const { joinTeam, leaveTeam, createTeam } = require("../services/teamService");
const {
  sendToUser,
  broadcastMessage,
  broadcastMessageIn,
} = require("../services/userService");
const Story = require("../models/Story");
const Protagonist = require("../models/Protagonist");

exports.handleConnection = (ws, request) => {
  const urlParts = request.url.split("/");
  const schoolId = urlParts[2];
  const userNickName = urlParts[3];
  const school = memory[schoolId];
  console.log(memory);
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
    case "setModeAndTeams":
      setModeAndTeams(school, data.mode, data.teams);
    case "setMode":
      setMode(school, data.mode, data.newUsers);
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
      handleOffer(school, userId, data);
      break;
    case "answer":
      handleAnswer(school, userId, data);
      break;
    case "candidate":
      handleCandidate(school, userId, data);
      break;
    case "startScreenSharing":
      handleShareScreen(school, userId, data);
      break;
    case "stopScreenShareSender":
      handleStopShareScreenSender(school, userId, data);
      break;
    case "stopScreenShareCompleted":
      handleStopShareScreenSenderCompleted(school, userId, data);
    case "stopShareScreen":
      handleStopShareScreen(school, userId, data);
      break;
    case "completed":
      handleCompleted(school, userId, data);
      break;
    case "librarySetting":
      handleLibrarySetting(school, userId, data.affiliationId);
      break;
    case "creatingBook":
      handleCreatingBook(school, userId, data);
      break;
    default:
      console.error(`Unknown message type (backend): ${data.type}`);
      break;
  }
};

exports.handleClose = (school, userId) => {
  // 해당 사용자를 찾는다
  const userIndex = school.users.findIndex((user) => user.id === userId);

  if (userIndex !== -1) {
    // 사용자의 웹소켓을 null로 설정하여 연결을 끊는다
    school.users[userIndex].websocket = null;
    school.users[userIndex].start = false;
    // 사용자를 모든 팀에서 제거
    Object.keys(school.teams).forEach((teamId) => {
      leaveTeam(school, userId, teamId);
    });

    const message = {
      type: "userDisconnected",
      userId,
    };

    // 유효한 웹소켓을 가진 사용자가 하나도 없으면 해당 학교를 메모리에서 삭제
    const allUsersDisconnected = school.users.every(
      (user) => user.websocket === null
    );

    if (allUsersDisconnected) {
      delete memory[school];
    } else {
      // 유효한 웹소켓을 가진 사용자에게만 메시지를 전송
      broadcastMessage(school, message);
    }
  } else {
    console.error(`User with ID ${userId} not found in school.`);
  }
};

function setModeAndTeams(school, mode, teams) {
  if (mode === "team") {
    createTeam(school, teams);

    teams.forEach((team) => {
      if (team.members.length > 0) {
        const teamLeader = team.members[0];
        team.leaderId = teamLeader.id;

        let teamMemberIds = [];
        team.members.forEach((member, index) => {
          if (index === 0) {
            member.screenOwner = "selfScreen";
            const targetIds = team.members.slice(1).map((m) => m.id); // 자신을 제외한 팀원들의 ID
            const sharing = targetIds.length > 0; // targetIds의 개수가 0개면 false, 그렇지 않으면 true
            member.start = !sharing;
            member.state = "personal";
            sendToUser(school, member.id, {
              type: "mode",
              state: "personal",
              sharing: sharing,
              targetIds: targetIds,
              mode,
            });
          } else {
            member.screenOwner = teamLeader.id;
            member.start = true;
            member.state = "shared";
            sendToUser(school, member.id, {
              type: "mode",
              state: "shared",
              sharing: false,
              mode,
            });
            teamMemberIds.push(member.id);
          }
        });
      }
    });

    const teacher = school.users.find((user) => user.nickname === "teacher");
    if (teacher) {
      teacher.start = true;
      teacher.state = "manage";
      sendToUser(school, teacher.id, {
        type: "mode",
        state: "manage",
        sharing: false,
        mode,
        teams,
      });
    }
  }
}

function setMode(school, mode, newUsers) {
  school.currentMode = mode;
  let targetIds = [];

  if (mode === "personal") {
    const teacher = school.users.find((user) => user.nickname === "teacher");

    school.users.forEach((user) => {
      if (user.nickname !== "teacher") {
        user.screenOwner = "selfScreen";
        user.start = true;
        user.state = "personal";
        sendToUser(school, user.id, {
          type: "mode",
          state: "personal",
          sharing: false,
          mode,
        });
        targetIds.push(user.id);
      }
    });
    if (teacher) {
      teacher.start = true;
      teacher.state = "manage";
      sendToUser(school, teacher.id, {
        type: "mode",
        state: "manage",
        sharing: false,
        users: school.users
          .filter((user) => user.nickname !== "teacher")
          .map((user) => ({
            id: user.id,
            nickname: user.nickname,
          })),
        mode,
        newUsers,
      });
    }
    setTimeout(() => {
      sendStartSignalToAllUsers(school);
    }, 2000);
  } else if (mode === "teacher") {
    const teacher = school.users.find((user) => user.nickname === "teacher");
    if (teacher) {
      school.users.forEach((user) => {
        if (user.id !== teacher.id) {
          user.start = true;
          user.screenOwner = "teacher";
          user.state = "shared";
          sendToUser(school, user.id, {
            type: "mode",
            state: "shared",
            sharing: false,
            mode,
          });
          targetIds.push(user.id);
        }
      });
      teacher.start = targetIds.length > 0 ? false : true;
      teacher.state = "personal";
      sendToUser(school, teacher.id, {
        type: "mode",
        state: "personal",
        sharing: true,
        targetId: "everyone",
        targetIds,
        mode,
      });
      const allStarted = school.users.every((user) => user.start === true);
      if (allStarted) {
        sendStartSignalToAllUsers(school);
      }
    }
  }

  return targetIds; // Returning targetIds for further use
}

function handleOffer(school, userId, data) {
  const message = {
    type: "offer",
    offer: data.offer,
    from: userId,
  };
  sendToUser(school, data.targetType, message);
}

function handleAnswer(school, userId, data) {
  const message = {
    type: "answer",
    answer: data.answer,
    from: userId,
  };
  sendToUser(school, data.targetType, message);
}

function handleCompleted(school, userId) {
  // 해당 유저의 start 속성을 true로 설정

  const user = school.users.find((user) => user.id === userId);
  if (user) {
    user.start = true;
  }
  console.log(school.users);
  // 해당 학교의 모든 유저의 start 속성이 true인지 확인
  const allStarted = school.users.every((user) => user.start === true);

  // 모든 유저의 start 속성이 true이면 신호 보내기
  if (allStarted) {
    sendStartSignalToAllUsers(school);
  }
}

function sendStartSignalToAllUsers(school) {
  school.users.forEach((user) => {
    const message = {
      type: "completed",
      state: user.state,
    };
    sendToUser(school, user.id, message);
  });
}

function handleCandidate(school, userId, data) {
  const message = {
    type: "candidate",
    candidate: data.candidate,
    from: userId,
  };
  sendToUser(school, data.targetType, message);
}

function handleShareScreen(school, userId, data) {
  const message = {
    type: "startScreenSharing",
    from: userId,
  };
  sendToUser(school, data.targetType, message);
}

function handleStopShareScreenSender(school, userId, data) {
  const message = {
    type: "stopScreenShareSender",
    newUserId: data.newUserId,
    from: userId,
  };
  sendToUser(school, data.targetType, message);
}

function handleStopShareScreenSenderCompleted(school, userId, data) {
  const message = {
    type: "stopScreenShareSenderCompleted",
    newUserId: data.newUserId,
    from: userId,
  };
  sendToUser(school, data.targetType, message);
}

function handleStopShareScreen(school, userId, data) {
  const message = {
    type: "stopScreenShare",
    from: userId,
  };

  sendToUser(school, data.targetId, message);
}

async function handleLibrarySetting(school, userId, affiliationId) {
  try {
    const stories = await Story.find({ user_id: affiliationId });
    // 주인공 데이터를 가져오기 위한 Promise 배열 생성
    const storiesWithProtagonists = await Promise.all(
      stories.map(async (story) => {
        const protagonists = await Protagonist.find({
          story_id: story._id,
        });
        return { ...story.toObject(), protagonists };
      })
    );

    // 조회한 스토리들과 주인공들을 웹소켓을 통해 프론트엔드로 전송합니다.
    const message = {
      type: "libraryStart",
      stories: storiesWithProtagonists, // 조회한 스토리들과 주인공들을 포함합니다.
    };
    sendToUser(school, userId, message);
  } catch (error) {
    console.error("Error fetching stories or protagonists:", error);
  }
}

async function handleCreatingBook(school, userId, data) {
  try {
    // Extract relevant data from the input
    const author = school.users.find((user) => user.id === userId);
    if (author.teamId) {
      const team = school.teams.find((team) => team.teamId === user.teamId);
      authorNickname = team.teamName;
    } else {
      authorNickname = author.nickname;
    }
    const newStory = new Story({
      user_id: data.affiliationId,
      title: null,
      author: authorNickname,
      publication_status: false,
      question_depth: data.depth,
      question_count: data.questionCount,
      question_extension_enabled: data.extensionEnabled,
    });

    // Save the new story to the database
    const savedStory = await newStory.save();

    // Create a message to send to the user
    const message = {
      type: "creatingBook",
      story: savedStory, // Include the saved story, which contains the _id
    };

    // Send the message to the user
    sendToUser(school, userId, message);
  } catch (error) {
    console.error("Error creating and saving the story:", error);
  }
}
