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
    color = getRandomColor()
  }while(color === lastColor)

  return color
}

module.exports = { getIPV4, getRandomColor, getRandomColorDifferentThanThePrevious };
