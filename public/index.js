const socket = io();

const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");


// display chat message on sneder

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


// display chat message on recipient

socket.on("chat message", (data) => {

  // timeout simulating a client ona different machine
  setTimeout(() => {

    const msgElement = document.getElementById(data.id);

    if (msgElement) {
      msgElement.style.fontWeight = "normal";
      msgElement.style.fontStyle = "normal";
    } else {
      const msg = document.createElement("li");
      msg.textContent = data.msg;
      msg.id = data.id;
      messages.appendChild(msg);
      window.scrollTo(0, document.body.scrollHeight);
    };

  }, 500);

});


// log connection status

socket.on('connect', () => {
  console.log('Socket has connected.');
});

socket.on('disconnect', () => {
  console.log('Socket has disconnected.');
});


// connect/disconnect button

const toggleButton = document.getElementById('toggle-btn');

  toggleButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (socket.connected) {
      toggleButton.innerText = 'Connect';
      socket.disconnect();
    } else {
      toggleButton.innerText = 'Disconnect';
      socket.connect();
    }
  });


  const dialog = document.getElementById('nameDialog');
  const nameInput = document.getElementById('name');

  // Function to open dialog
  
  function showDialog() {
    const storedName = localStorage.getItem('userName');
    if(storedName) {
      nameInput.value = storedName;
    }
    dialog.showModal();
  }

  window.onload = showDialog;

  document.getElementById('confirmBtn').onclick = function() {
    const name = nameInput.value;
    console.log("Name entered:", name);
    localStorage.setItem('userName', name); // Save the name to localStorage
    dialog.close();
  };