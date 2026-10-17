const socket = io();
const joinPanel = document.getElementById('join-panel');
const chatPanel = document.getElementById('chat-panel');
const joinForm = document.getElementById('join-form');
const usernameInput = document.getElementById('username');
const joinError = document.getElementById('join-error');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messages = document.getElementById('messages');
const usersList = document.getElementById('users-list');
const onlineCount = document.getElementById('online-count');
const userCount = document.getElementById('user-count');
const connectionStatus = document.getElementById('connection-status');
let myName = '';

socket.on('connect', () => connectionStatus.textContent = 'Connected to chat server.');
socket.on('disconnect', () => connectionStatus.textContent = 'Disconnected. Trying to reconnect…');
socket.on('connect_error', (err) => connectionStatus.textContent = `Connection error: ${err.message}`);

joinForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = usernameInput.value.trim();
  if (!name) { joinError.textContent = 'Please enter a display name.'; return; }
  joinError.textContent = '';
  socket.emit('join chat', name);
});
socket.on('join success', ({ name }) => {
  myName = name; joinPanel.hidden = true; chatPanel.hidden = false; messageInput.focus();
});
messageForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message) return;
  socket.emit('chat message', message); messageInput.value = ''; messageInput.focus();
});
socket.on('chat message', (data) => {
  removeEmptyState();
  const item = document.createElement('article');
  item.className = `message${data.name === myName ? ' mine' : ''}`;
  const meta = document.createElement('div'); meta.className = 'message-meta';
  meta.textContent = `${data.name} · ${new Date(data.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
  const text = document.createElement('div'); text.className = 'message-text';
  text.textContent = data.message;
  item.append(meta, text); messages.appendChild(item); messages.scrollTop = messages.scrollHeight;
});
socket.on('system message', (message) => {
  removeEmptyState(); const item = document.createElement('div');
  item.className = 'system-message'; item.textContent = message;
  messages.appendChild(item); messages.scrollTop = messages.scrollHeight;
});
socket.on('active users', (users) => {
  usersList.replaceChildren();
  users.forEach(name => { const li = document.createElement('li'); li.textContent = name; usersList.appendChild(li); });
  onlineCount.textContent = users.length; userCount.textContent = users.length;
});
socket.on('chat error', (message) => { joinError.textContent = message; connectionStatus.textContent = message; });
function removeEmptyState() { const el = messages.querySelector('.empty-state'); if (el) el.remove(); }
