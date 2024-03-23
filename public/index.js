const socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    const msg = document.createElement("li");
    msg.textContent = input.value;
    msg.id = "msg-" + Date.now();
    msg.style.fontStyle = "italic";
    messages.appendChild(msg);
    window.scrollTo(0, document.body.scrollHeight);

    socket.emit(
      "chat message",
      { msg: input.value, id: msg.id },
      (response) => {
        if (response) {
          const msgElement = document.getElementById(response.id);
          if (msgElement) {
            msgElement.style.fontWeight = "Bold";
          }
        }
      }
    );

    input.value = "";
  }
});

socket.on("chat message", (data) => {
  // timeout simulating a client ona different machine
  setTimeout(() => {
    const msgElement = document.getElementById(data.id);
    if (msgElement) {
      msgElement.style.fontWeight = "normal";
      msgElement.style.fontStyle = "normal";
    }
  }, 500);
});
