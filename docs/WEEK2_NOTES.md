# Week 2 Technical Notes

## Connection setup
The application creates an HTTP server from Express and attaches Socket.IO to it. The browser loads `/socket.io/socket.io.js` and calls `io()` to connect to the same origin.

## Event handling
- `join chat`: validates a display name and records the socket in the active-user map.
- `chat message`: checks that the user has joined and broadcasts a non-empty message.
- `disconnect`: removes the user and broadcasts a leave notice and updated list.
- `connect_error` and `disconnect`: update connection status in the client.

## Challenges and solutions
1. Keeping active users current: broadcast the list after joins and disconnects.
2. Avoiding blank messages: trim the message and ignore empty content.
3. Safely displaying user text: use DOM `textContent` rather than `innerHTML`.
4. Testing multiple participants: use two or more browser tabs with different display names.

Before submitting, run the app and collect screenshots of two connected clients, a message in both clients, and the active list after one client leaves.