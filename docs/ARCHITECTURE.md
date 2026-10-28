# System Architecture

## Overview
Chatify is a full-stack, real-time messaging application. It consists of an Express HTTP and Socket.io server running on Node.js and a Single Page Application (SPA) built with React 19 and Vite.

```
+-------------------------------------------------------------------+
|                        Client Browser                             |
|  React 19 (Vite) + Tailwind CSS + DaisyUI + Zustand + Axios       |
+-------------------+-----------------------------------------------+
                    | (HTTP / REST)                 | (WebSocket)
                    v                               v
+-------------------+-------------------------------+---------------+
|                        Backend Server                             |
|  Express.js App                                   Socket.io Server|
|  - Auth Routes (/api/auth)                        - Handshake Auth|
|  - Message Routes (/api/messages)                 - Room / Direct |
|  - Arcjet Rate/Bot Shield                         - Presence Sync |
+---------+-------------------------+-------------------------------+
          |                         |
          v                         v
+---------+----------+    +---------+----------+    +---------------+
|  MongoDB Database  |    |  Cloudinary API    |    |  Resend API   |
|  - Users           |    |  - Profile Pics    |    |  - Welcome    |
|  - Messages        |    |  - Chat Images     |    |    Emails     |
+--------------------+    +--------------------+    +---------------+
```

---

## Backend Architecture

### Core Technologies
- **Runtime**: Node.js (ES Modules, `"type": "module"`)
- **Web Framework**: Express v4.21.2
- **WebSockets**: Socket.io v4.8.1 (mounted on native Node HTTP server)
- **Database ORM**: Mongoose v8.10.1
- **Security & Utilities**:
  - `bcryptjs`: Password hashing (10 salt rounds)
  - `jsonwebtoken`: Authentication token generation and verification
  - `cookie-parser`: Cookie extraction from requests
  - `cors`: Cross-Origin Resource Sharing handling
  - `@arcjet/node` & `@arcjet/inspect`: Bot detection and rate limiting
  - `cloudinary`: Image hosting
  - `resend`: Transactional email delivery

### Server Entry Point
- Entry point: `backend/src/server.js`
- Server listens on `PORT` (defaults to 3000).
- Connects to MongoDB on startup via `connectDB()` (`backend/src/lib/db.js`).
- Middleware pipeline:
  1. `express.json({ limit: "5mb" })`
  2. `cors({ origin: allowedOrigins, credentials: true })`
  3. `cookieParser()`
  4. Route handlers: `/api/auth` and `/api/messages`
  5. In production mode (`NODE_ENV === "production"`), serves static assets from `frontend/dist`.

### Authentication & Authorization Flow
1. Client submits credentials to `/api/auth/signup` or `/api/auth/login`.
2. Controller validates input, checks database, hashes password (for signup) or compares hashes (for login).
3. If valid, `generateToken(userId, res)` creates a JWT signed with `JWT_SECRET` (7 days expiry) and sets an `httpOnly` cookie named `jwt`.
4. Subsequent protected HTTP requests pass through `protectRoute` middleware (`backend/src/middleware/auth.middleware.js`), which validates the `jwt` cookie, looks up the user without password, and populates `req.user`.

### WebSockets & Real-Time Presence
- Socket server configured in `backend/src/lib/socket.js`.
- Authentication via `socketAuthMiddleware` (`backend/src/middleware/socket.auth.middleware.js`), which parses `jwt` from handshake cookie header `socket.handshake.headers.cookie`.
- Online users tracked in memory via `userSocketMap: { [userId: string]: socketId }`.
- Broadcasts `getOnlineUsers` on user connect and disconnect.
- Emits `newMessage` event directly to recipient's socket ID when a message is sent.

---

## Frontend Architecture

### Core Technologies
- **Framework**: React 19 (`react`, `react-dom`)
- **Bundler**: Vite v7
- **Routing**: React Router v7 (`react-router`)
- **State Management**: Zustand v5
- **HTTP Client**: Axios v1.11.0
- **Styling**: Tailwind CSS v3 with DaisyUI v4
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Application State & Stores
- `useAuthStore` (`frontend/src/store/useAuthStore.js`):
  - State: `authUser`, `isCheckingAuth`, `isSigningUp`, `isLoggingIn`, `socket`, `onlineUsers`
  - Actions: `checkAuth`, `signup`, `login`, `logout`, `updateProfile`, `connectSocket`, `disconnectSocket`
  - Handles WebSocket lifecycle: connects on successful auth, disconnects on logout.
- `useChatStore` (`frontend/src/store/useChatStore.js`):
  - State: `allContacts`, `chats`, `messages`, `activeTab`, `selectedUser`, `isUsersLoading`, `isMessagesLoading`, `isSoundEnabled`
  - Actions: `getAllContacts`, `getMyChatPartners`, `getMessagesByUserId`, `sendMessage`, `subscribeToMessages`, `unsubscribeFromMessages`, `setSelectedUser`, `setActiveTab`, `toggleSound`
  - Optimistic updates: appends temporary message object before sending POST request, rolls back on error.

### Routing & Views
- `frontend/src/App.jsx` handles global authentication check on mount (`checkAuth`).
- Routes:
  - `/`: Protected route (`ChatPage`), redirects to `/login` if unauthenticated.
  - `/login`: Public auth route (`LoginPage`), redirects to `/` if authenticated.
  - `/signup`: Public registration route (`SignUpPage`), redirects to `/` if authenticated.

### Responsive Design & Layout Approach
- **Mobile-First Breakpoint Architecture**:
  - `sm` (`640px`): Handheld phablets & small tablets. Transitions full-bleed mobile shells into rounded card containers with background spacing.
  - `md` (`768px`): Tablet portrait & split-screen threshold. Below `md`, the interface employs a single-pane model (showing either the sidebar list or the active chat pane with a dedicated Back button). At `md` and above, the two panes display side-by-side (`w-80` sidebar + `flex-1` chat pane).
  - `lg` (`1024px`) / `xl` (`1280px`): Desktop & widescreen. Centered within a `max-w-6xl` shell with animated border decorators.
- **Dynamic Viewport Heights**:
  - Utilizes CSS dynamic viewport units (`100dvh`, `h-dvh`, `min-h-dvh`) across `html`, `body`, `#root`, and main container wrappers to avoid mobile browser navigation bar clipping and on-screen keyboard cutoff.
- **Scroll Decoupling & Flex Isolation**:
  - Headers (`ChatHeader`, `ProfileHeader`) and the input bar (`MessageInput`) are locked with `shrink-0`.
  - Content lists (`ChatsList`, `ContactList`, and `ChatContainer` message history) are bounded with `flex-1 min-h-0 overflow-y-auto` to isolate scrolling to the message feed without moving the app frame.
- **Touch & Accessibility Standards**:
  - Minimum touch target dimension of 44x44px enforced on all interactive buttons, icon triggers, tabs, and form actions.
  - Form inputs enforce a minimum 16px font size (`text-[16px] sm:text-sm`) to prevent automatic iOS Safari viewport zoom on input focus.
  - Notches and home indicators handled via `viewport-fit=cover` and `env(safe-area-inset-*)`.
- **Text & Media Constraint**:
  - Message bubbles apply `max-w-[85%] sm:max-w-[75%] break-words [overflow-wrap:anywhere]` to prevent long strings or URLs from causing horizontal scrollbars.
  - Images enforce `max-w-full max-h-48 sm:max-h-60 w-auto object-cover` to adapt proportionally to varying screen dimensions.

---

## External Services & Integrations
- **MongoDB**: Primary document database storing `User` and `Message` collections.
- **Cloudinary**: Cloud storage for base64-encoded profile pictures and image attachments.
- **Resend**: Sends welcome emails on successful user registration.
- **Arcjet**: Analyzes incoming traffic for bot classification and enforces sliding window rate limits.
