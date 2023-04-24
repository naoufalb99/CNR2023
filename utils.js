const getIPV4 = (remoteAddress) => {
  return remoteAddress.replace(/^:*/, "").split(":").at(-1);
};

const getRandomColor = () => {
  const colors = ["GREEN", "RED", "BLUE", "YELLOW"];

  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomColorDifferentThanThePrevious = (lastColor) => {
  let color;

  do {
    color = getRandomColor();
  } while (color === lastColor);

  return color;
};

const emitLog = (io, message) => {
  io.emit("LOG", { message });
  console.log(message);
};

module.exports = {
  getIPV4,
  getRandomColor,
  getRandomColorDifferentThanThePrevious,
  emitLog,
};
