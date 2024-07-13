exports.getStories = (req, res) => {
  // 스토리 목록을 가져오는 로직
  res.send("Get all stories");
};

exports.createStory = (req, res) => {
  // 새로운 스토리를 생성하는 로직
  res.send("Create a new story");
};

exports.updateStory = (req, res) => {
  // 기존 스토리를 업데이트하는 로직
  res.send("Update a story");
};

exports.deleteStory = (req, res) => {
  // 기존 스토리를 삭제하는 로직
  res.send("Delete a story");
};
