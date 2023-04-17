const express = require("express");
const { getIPV4, getRandomColorDifferentThanThePrevious } = require("./utils");

const app = express();

const PORT = 80;

const usersLastColor = new Map();

app.use((req, _res, next) => {
  const ipAddress = getIPV4(req.socket.remoteAddress);
  req.participantIP = ipAddress;

  console.log(`\n[IP] -- ${ipAddress}`);
  next();
});

// Block users coming from a browser
app.use((req, res, next) => {
  const userAgent = req.headers["user-agent"];
  if (typeof userAgent === "string" && /^Mozilla/.test(userAgent)) {
    console.log(
      `[${req.participantIP}] has been blocked (coming from a browser)`
    );
    res.send("Unauthorized.");
  } else {
    next();
  }
});

app.get("/", (_, res) => {
  res.send("CNR - Robotique FSR");
});

app.get("/START", (req, res) => {
  console.log(`[${req.participantIP}] requested /START`);
  console.log(`[${req.participantIP}] received MOVE`);
  res.send("MOVE");
});

app.get("/ZONE1", (req, res) => {
  const lastColor = usersLastColor.get(req.participantIP);
  const color = getRandomColorDifferentThanThePrevious(lastColor);
  usersLastColor.set(req.participantIP, color);

  console.log(`[${req.participantIP}] requested /ZONE1`);
  console.log(`[${req.participantIP}] received ${color}`);
  res.send(`${color}`);
});

app.get("/ZONE2", (req, res) => {
  const lastColor = usersLastColor.get(req.participantIP);
  const color = getRandomColorDifferentThanThePrevious(lastColor);
  usersLastColor.set(req.participantIP, color);

  console.log(`[${req.participantIP}] requested /ZONE2`);
  console.log(`[${req.participantIP}] received ${color}`);
  res.send(`${color}`);
});

app.get("/DONE", (req, res) => {
  console.log(`[${req.participantIP}] requested /DONE`);
  console.log(`[${req.participantIP}] received GOOD`);
  res.send("GOOD");
});

app.listen(PORT, () => {
  console.log("Server listening on PORT", PORT);
});
