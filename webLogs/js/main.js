import { io } from "./socket.io.js";

let socket = io("http://localhost");

const logsNode = document.getElementById("logs");
const searchInput = document.querySelector(".search input");
const searchButton = document.querySelector(".search button");

searchButton.addEventListener("click", () => {
  const inputValue = searchInput.value;

  const logLines = logsNode.querySelectorAll("div");
  logLines.forEach((elm) => {
    if (!inputValue || elm.dataset.ip === inputValue) {
      elm.style.display = "block";
    } else {
      elm.style.display = "none";
    }
  });
});

socket.on("LOG", ({ message }) => {
  const logElement = document.createElement("div");

  const ip = message.match(/\[(.+)\]/)[1];
  logElement.dataset.ip = ip;

  logElement.innerHTML = message
    .replace(/(\/[^\s]+)/gi, "<span class='url'>$1</span>")
    .replace(/(\[.+\])/gi, "<span class='ip'>$1</span>")
    .replace(/(GREEN|RED|BLUE|YELLOW)/gi, "<span class='color'>$1</span>");

  const inputValue = searchInput.value;

  if (!inputValue || logElement.dataset.ip === inputValue) {
    logElement.style.display = "block";
  } else {
    logElement.style.display = "none";
  }

  logsNode.append(logElement);
});
