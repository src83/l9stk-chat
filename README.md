## L9STK Chat — Chat Module for Laravel 9 Starter Kit

**Русская версия:** [README-RU.md](README-RU.md)

**This application is a working prototype of a platform-oriented approach based on the L9STK Core v0.4.0 modular monolith.**

- STK repository and documentation: https://github.com/src83/l9stk
- STK version: v0.4.0
- Application version: v0.2.0
- Status: Production
- Laravel: v9.52.21
- PHP: 8.2

---

### Purpose

- Implementation of a functional chat module
- Validation of modular architecture
- Suitable for production and demo usage

---

### Features

- Message sending and incremental loading via AJAX
- Automatic scroll to the latest message
- Prevention of duplicate message rendering
- Input constraints with user feedback
- Responsive layout for mobile devices

---

### UX / UI

- Auto-growing textarea
- Enter to send (Shift + Enter for newline)
- Input limits with visual feedback
- Prevention of duplicate message rendering
- Automatic scroll to the latest message
- Responsive layout (mobile-friendly)
- Flexbox-based layout

---

### Flexbox layout hierarchy

```txt
html (height:100%)
 └── body (flex, column, height:100%)
     └── #app (flex, column, flex:1)
         ├── nav (flex:0 0 auto)
         └── main.py-md-4 (flex, flex:1)
             └── .container.application (flex, flex:1)
                 └── .conversation (flex, column, flex:1)
                     ├── .message (flex:1, overflow-y:auto)
                     └── .reply (flex:0 0 auto)
```

---

### Limitations

- No user registration (users are created manually)
- Single chat room (global chat)
- No WebSocket support (HTTP polling is used)
- No delivery/read status tracking on the backend
- No push notifications

---

### Roadmap

- Upgrade to the latest stable Laravel version
- Debounce for send button
- WebSocket integration
- Backend support for delivery/read statuses
- Consistent data mapping between DOM and database
- Push notifications
- Multi-room support
- Authentication improvements

---

### API

#### Send Message (Request)

`POST /cabinet/chat/ajax/messages`

```json
{
  "text": "Message text",
  "client_id": "c_1775429886854_ob6idj40ub"
}
```

#### Send Message (Response)

```json
{
  "code_http": 201,
  "code_text": "Created",
  "message_key": "chat.post_created",
  "data": {
    "user_id": 1,
    "client_id": "c_1775429886854_ob6idj40ub",
    "text": "Message text",
    "status": "sent",
    "updated_at": "2026-04-05T22:58:06.000000Z",
    "created_at": "2026-04-05T22:58:06.000000Z",
    "id": 4,
    "user": {
      "id": 1,
      "name": "my-user-name"
    }
  }
}
```

#### Fetch Messages

Request:

`GET /cabinet/chat/ajax/messages?last_id=3`

Response:
```json
{
  "messages": [
    {
      "id": 4,
      "user_id": 1,
      "client_id": "c_1775429886854_ob6idj40ub",
      "text": "Message text",
      "status": "sent",
      "created_at": "2026-04-05T22:58:06.000000Z",
      "updated_at": "2026-04-05T22:58:06.000000Z",
      "user": {
        "id": 1,
        "name": "my-user-name"
      }
    }
  ]
}
```
