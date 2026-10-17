# Week 2: Real-Time Chat Application

A real-time chat room built with Node.js, Express, and Socket.IO for the Yuva Intern Junior Node.js Developer internship.

## Features
- Join a shared chat using a display name
- Broadcast messages to all connected users in real time
- Display active users and join/leave notifications
- Connection status, connection error feedback, and server event logs
- Limits for display-name and message length
- Responsive HTML/CSS client
- `/health` endpoint

## Requirements
Node.js 18+ recommended and npm. No database or Postman is required.

## Install and run
1. Extract this ZIP and open the project folder in VS Code.
2. Run `npm install`.
3. Run `npm start`.
4. Open `http://localhost:3000`.
5. Join with a display name.
6. Open the same URL in a second browser tab with another name to test real-time chat.

Keep the server terminal running. Press Ctrl+C to stop it. For development, run `npm run dev`.

## How real-time messaging works
Express serves files from `public`. Socket.IO is attached to the same HTTP server and creates an event-based connection between each browser and the server. The client emits `join chat`; the server validates and stores the name, then broadcasts the active-user list. When a client emits `chat message`, the server checks that the user joined and the message is not empty, then broadcasts it to all clients. When a socket disconnects, the server removes that user and broadcasts a leave notice and updated user list.

## Socket events
| Event | Direction | Purpose |
|---|---|---|
| `join chat` | Client → Server | Request to join |
| `join success` | Server → Joining client | Confirm join |
| `chat message` | Client → Server | Submit message |
| `chat message` | Server → All clients | Broadcast message |
| `active users` | Server → All clients | Refresh user list |
| `system message` | Server → Clients | Join/leave notice |
| `chat error` | Server → Client | Validation/usage error |

## Project structure
```text
yuva-week2-realtime-chat/
├── public/
│   ├── client.js
│   ├── index.html
│   └── styles.css
├── docs/WEEK2_NOTES.md
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Manual testing checklist
- Open two browser tabs with different names.
- Confirm both names appear in Active users.
- Send a message and confirm it appears in both tabs.
- Close one tab and confirm its name is removed and a leave notice appears.
- Visit `http://localhost:3000/health`.
Only report tests as passed after you run them.

## Challenges and limitations
Keeping active users synchronized is handled by updating the list on join and disconnect. User messages are inserted with `textContent`, not `innerHTML`, to display them as text. Active users are stored in memory and reset when the server restarts. This demo has no authentication, database-backed history, private messages, or multi-room support.
