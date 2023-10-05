const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

console.log(username, room);

const socket = io();

// Join chatroom

socket.emit("joinRoom", { username, room });

// Get room and users

socket.on("roomUsers", ({ room, users }) => {
  outputRoom(room);
  outputUsers(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text

  let msg = e.target.elements.msg.value;
  msg = msg.trim();
  console.log(msg);

  if (!msg) {
    return false;
  }

  // Emit message to server

  socket.emit("ChatMessage", msg);

  // Clear input

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM

function outputMessage(message) {
  div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

// Add roomName to DOM

function outputRoom(room) {
  roomName.innerText = room;
}

//Add Users to DOM

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
`;
}
