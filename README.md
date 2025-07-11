# 💬 QuickChat

A real-time chat application built with the MERN stack and Socket.IO. Users can sign up, log in, chat with others, share media, update their profile, and see online users — all in a sleek modern interface.

🔗 **Live Demo**: [QuickChat on Vercel](https://chat-app-git-main-subharthys-projects.vercel.app/login)


---

## 🚀 Features

- ✅ User authentication (signup & login)
- 💬 Real-time messaging using Socket.IO
- 📸 Send text and image messages
- 👤 Update profile (bio, name, and profile picture)
- 🟢 View online users in sidebar
- ❌ Delete chats between users
- 🎨 Responsive and stylish UI built with React

---

## 🛠️ Tech Stack

### ⚙️ Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Socket.IO (WebSocket-based messaging)

### 🎨 Frontend
- React.js (Vite)
- Tailwind CSS (or standard CSS)
- Axios for HTTP requests
- Cloudinary for image uploads

---

## 🧩 Folder Structure

```bash
├── client/             # Frontend (React)
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       └── App.jsx
├── server/             # Backend (Express)
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── configs/
│   └── server.js
