export const parseTeamMembers = membersString => {
  return membersString.split(',').map(member => member.trim());
};

// 추가로 필요한 헬퍼 함수들을 이곳에 추가할 수 있습니다.
