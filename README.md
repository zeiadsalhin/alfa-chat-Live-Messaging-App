# 💬 Alfa Chat - Realtime Messaging App

A modern, fast, and secure chat application built with **React**, **Socket.IO**, and **localStorage**, inspired by WhatsApp, Telegram UI. Alfa Chat provides instant messaging, voice notes, and a smooth real-time experience — no sign-up, just start chatting!

![screenshot](https://alfa-chat.netlify.app/Screenshot.png) <!-- Replace with actual screenshot -->

---

## 🌍 Live Demo

[🔗 Visit Here](https://alfa-chat.netlify.app) <!-- Replace this with your actual deployed URL -->

Note: Please wait 10-20s if server connection warning appeared for first time (due to render.com init), Thank you

---

## ✨ Features

- ⚡ **Realtime Messaging** via Socket.IO
- 🔐 **Authentication** using localStorage
- 📞 **Voice Message Support**
- 💬 **Typing Indicator** and **Message Status** (Sent, Delivered, Seen)
- 🔁 **Persistent Chat History** stored in localStorage
- 🌐 **i18n Language Detection** with Arabic + English support
- 📱 **Responsive Design** (Desktop & Mobile)
- ✅ **Protected Routes** and Middleware
- 📡 **Connection Monitoring** with Offline Banner
- 🎛 **Chat Management** (Edit, Delete, Clear Chat)
- 🖼 **Dynamic Avatar Generator** via Dicebear
- 🎨 **Custom Logo & Animated Background**

---

## 🛠️ Tech Stack

- ⚛️ **React 19** – Frontend Framework with Vite
- 🔌 **Socket.IO** – Real-time WebSocket Communication
- 🧠 **localStorage** – Lightweight Client-side DB
- 🌍 **i18next** – Internationalization & Language Detection
- 🎨 **Tailwind CSS v4** – Styling & UI Components
- 🎙 **MediaRecorder API** – Voice Recording Support (Upcoming)
- 🧪 **Custom Middleware** – Authentication & Route Guard

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/zeiadsalhin/alfa-chat.git
cd alfa-chat
npm install
npm run dev
```
***Make sure your backend server (Socket.IO) is running on the correct port.***

---

## 🧩 Folder Structure

```bash
alfa-chat/
├── public/
│   └── index.html
│
├── src/
│   ├── assets/                   # Images, icons
│   ├── components/              # Reusable UI components
│   │   ├── ChatInput.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── ChatWindow.tsx
│   │   ├── Footer.tsx
│   │   └── LogoBackground.tsx
│   │
│   ├── hooks/                   # Custom React hooks
│   │   └── useRecorder.ts
│   │
│   ├── lib/                     # Library utilities (socket instance)
│   │   └── socket.ts
│   │
│   │── i18n/                    # Internationalization AR-EN
│   │   └── index.tsx
│   │
│   ├── middleware/              # Route guards
│   │   └── Middleware.tsx
│   │
│   ├── pages/                   # Pages
│   │   ├── ChatRoom.tsx
│   │   ├── JoinPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── StoredChatsPage.tsx
│   │
│   ├── types/                   # TypeScript interfaces and types
│   │   └── message.ts
│   │
│   │── index.css                # Custom CSS / Tailwind extensions
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
│
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
```
---

## ✅ Completed Features

- 🔐 **Authentication Middleware**  
  Automatically redirects unauthenticated users to the Register page using localStorage-based session check.

- 👤 **Register Page**  
  Modern UI to register with a custom username and store it in localStorage.

- 💬 **Real-Time Chat System**  
  Send and receive messages instantly using **Socket.IO**. Supports:
  - 📝 Text messages  
  - 🎤 Voice messages (via microphone recording) (Upcoming) 
  - ✅ Delivery status (sent, delivered, seen)  
  - 👀 Seen status for all messages  

- 💾 **Chat History Persistence**  
  Messages are saved in localStorage per room, even across sessions.

- 🧠 **Typing Indicator**  
  Displays "typing" status when another user is typing.

- 🗑 **Clear Chat & Edit Mode**  
  Ability to delete selected chats or clear entire chat room history.

- 🌐 **Internationalization (i18n)**  
  Language auto-detection with fallback to en, normalizes codes like ar-AE → ar to avoid issues in translations.

- 🎨 **Modern UI Design**  
  Clean and responsive layout with Tailwind CSS v4.

- 🦺 **Server Offline Detection**  
  Offline banner shows in real-time when socket disconnects, using heartbeat checks.

- 📱 **Responsive Design**  
  Mobile and desktop friendly with adaptive layout.

- 🏷 **Reusable Components**  
  Including `ChatInput`, `ChatHeader`, `ChatWindow`, and `Footer`.

- 🎧 **Audio Recorder Hook**  
  Built-in microphone support via a custom `useRecorder` hook.

- 💡 **Dynamic UI Enhancements**  
  - Auto-focus on input field when chat loads  
  - Repeated animated logo background on register page  
  - Conditional footer display  
  - Dynamic layout adjustment when server banner is visible

---

## 📄 License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License — you're free to use, modify, and distribute it with attribution.

---

## 🙌 Credits

- ⚡️ Built with ❤️ using **React 19** + **Tailwind CSS v4**
- 📡 Real-time backend powered by **Socket.IO**
- 🎨 Inspired by **WhatsApp Web** UI aesthetics
- 🧪 Deployed and maintained by [Zeiad Abdeltawab](https://github.com/zeiadsalhin)

Icons by [Lucide](https://lucide.dev/) • Avatar generation by [DiceBear](https://www.dicebear.com/)
