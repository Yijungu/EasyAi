function joinTeam(school, userId, teamId) {
  if (!school.teams[teamId]) {
    school.teams[teamId] = [];
  }
  school.teams[teamId].push(userId);
}

function leaveTeam(school, userId, teamId) {
  if (school.teams[teamId]) {
    school.teams[teamId] = school.teams[teamId].filter((id) => id !== userId);
    if (school.teams[teamId].length === 0) {
      delete school.teams[teamId];
    }
  }
}

const createTeam = (school, teams) => {
  if (!school.teams) {
    school.teams = [];
  }
  teams.forEach((team) => {
    const teamId = school.teams.length + 1;
    const leader = school.users.find(
      (user) => user.nickname === team.teamMembers[0]
    );
    const memberIds = team.teamMembers
      .map((nickname) => {
        const member = school.users.find((user) => user.nickname === nickname);
        return member ? member.id : null;
      })
      .filter((id) => id !== null);

    if (!leader || memberIds.length === 0) {
      console.error(
        `Error: Unable to find leader or members for team ${team.teamName}`
      );
      return;
    }

    school.teams.push({
      teamId,
      teamName: team.teamName,
      leaderId: leader.id, // Store leader's ID
      members: memberIds, // Store members' IDs
    });

    memberIds.forEach((memberId) => {
      const user = school.users.find((user) => user.id === memberId);
      if (user) {
        user.teamId = teamId;
      }
    });
  });

  console.log(`Created ${teams.length} teams in school ${school.id}.`);
};

module.exports = {
  joinTeam,
  leaveTeam,
  createTeam,
};
