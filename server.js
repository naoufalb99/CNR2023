const express = require("express");
const { Server: SocketIOServer } = require("socket.io");
const http = require("http");
const path = require("path");
const {
  getIPV4,
  getRandomColorDifferentThanThePrevious,
  emitLog,
} = require("./utils");

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);

const PORT = 80;

const usersLastColor = new Map();

const webLogPath = "az";

app.use(`/${webLogPath}`, express.static(path.join(__dirname, "webLogs")));

app.get("/", (_, res) => res.send("CNR - Robotique FSR"));

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
    emitLog(
      io,
      `[${req.participantIP}] ${req.path} has been blocked (coming from a browser)`
    );
    res.send("Unauthorized.");
  } else {
    next();
  }
});

app.get("/START", (req, res) => {
  emitLog(io, `[${req.participantIP}] requested /START`);
  emitLog(io, `[${req.participantIP}] received MOVE`);
  res.send("MOVE");
});

app.get("/ZONE1", (req, res) => {
  const lastColor = usersLastColor.get(req.participantIP);
  const color = getRandomColorDifferentThanThePrevious(lastColor);
  usersLastColor.set(req.participantIP, color);

  emitLog(io, `[${req.participantIP}] requested /ZONE1`);
  emitLog(io, `[${req.participantIP}] received ${color}`);
  res.send(`${color}`);
});

app.get("/ZONE2", (req, res) => {
  const lastColor = usersLastColor.get(req.participantIP);
  const color = getRandomColorDifferentThanThePrevious(lastColor);
  usersLastColor.set(req.participantIP, color);

  emitLog(io, `[${req.participantIP}] requested /ZONE2`);
  emitLog(io, `[${req.participantIP}] received ${color}`);
  res.send(`${color}`);
});

app.get("/DONE", (req, res) => {
  emitLog(io, `[${req.participantIP}] requested /DONE`);
  emitLog(io, `[${req.participantIP}] received GOOD`);
  res.send("GOOD");
});

server.listen(PORT, () => {
  console.log("Server listening on PORT", PORT);
  console.log(`Web logs http://localhost:${PORT}/${webLogPath}`);
});
