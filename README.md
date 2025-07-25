# 🤖 AI Collaborative Chat App

A real-time collaborative chat application where users can communicate with each other **and with AI** in the same chat room. Just mention `@ai` in your message, and the built-in AI assistant will respond!  
This project features real-time messaging, live code sharing, **HTML/CSS/JS code preview**, and a **shared Express.js server runtime** — all secured with **JWT authentication**.


## ✨ Features

- 💬 **Real-time Chat:** Collaborators can chat live via WebSockets (Socket.io).
- 🤖 **AI Assistant:** Mention `@ai` in your message to get a response from the AI.
- 🔐 **JWT-based Authentication:** Secure login and token-based session handling.
- 👨‍💻 **Live Code Preview:** Write, preview, and **edit** HTML/CSS/JavaScript code in real-time.
- 💡 **AI Code Generator:** AI can generate HTML, CSS, and JS code when prompted, which you can immediately preview and modify.
- 🚀 **Run Express Server:** Collaboratively build and run Express.js backend in real-time.

---

💻 Live Code Preview (With AI)
Collaborators can collaboratively write and preview:

✅ HTML

✅ CSS

✅ JavaScript

✨ AI can generate HTML/CSS/JS code snippets upon request (e.g., @ai make a responsive navbar)
The generated code is:

Automatically inserted into the editor

Rendered live in a browser preview

Fully editable by any user in real time

This makes it a powerful tool for frontend prototyping, learning, and AI-assisted development.

🚀 Shared Express Server
Collaborators can write backend code (e.g., APIs or middleware) in Node.js using Express and run it live in a shared container.
Output (like logs, errors) is streamed to all collaborators for real-time debugging and development.

🧪 Tech Stack
Frontend: React, Tailwind CSS, Socket.io-client

Backend: Express.js, Socket.io, Node.js

Authentication: JWT + MongoDB,redix

Database: MongoDB Atlas

AI Integration: Gemini


