# Personal Messaging App - Setup & Usage

Your real-time chat app is now configured for **personal one-to-one messaging only** — just like WhatsApp or Instagram DMs.

## How it works

1. **Login/Sign Up**: Users create an account with email/password or Google sign-in.
2. **User List**: After login, users see a sidebar with all other users.
3. **Start Chat**: Click any user to open a direct chat with them.
4. **Send Messages**: Type and send personal messages that only that user can see.

## Architecture

- **No group chat**: Each message has a `to` field pointing to the specific recipient.
- **Two-way chat**: Messages are stored once; both users see the same conversation.
- **User discovery**: All authenticated users can see each other in the sidebar.

## Key Files

- `src/Pages/Chat.jsx` — Individual chat page (route: `/chat/:uid`)
- `src/Pages/Home.jsx` — User list landing page
- `src/Components/UsersList.jsx` — Sidebar with users
- `src/context/AuthContext.jsx` — Auth & user management
- `src/App.css` — Modern UI design

## Firestore Data Model

### `users` collection
```
users/{userId}
  ├── uid: string
  ├── displayName: string
  ├── email: string
  ├── photoURL: string
  └── lastSeen: timestamp
```

### `messages` collection
```
messages/{messageId}
  ├── uid: string (sender's UID)
  ├── to: string (recipient's UID)
  ├── text: string
  ├── user: string (sender's display name)
  ├── toName: string (recipient's display name)
  ├── createdAt: timestamp
```

## Firestore Rules (Important!)

Make sure your Firestore security rules are set correctly. See `FIRESTORE_RULES.md` for the rules you need to apply.

## Future Enhancements

- Last message preview in user list
- Typing indicators
- Read receipts
- User online/offline status
- Message search
- Block/mute users
