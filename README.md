# ⚙️ CodeMates Backend API

The robust server-side engine powering **CodeMates** — a niche social networking platform for developers. Built with the **MERN** stack architecture to handle real-time communication and high-performance data processing.

---

## 🚀 Core Functionalities

### 🛡️ Secure Authentication
- **JWT & Bcrypt:** Industrial-grade security for user sessions and password hashing.
- **Role-based Access:** Protected middleware for authorized route access.

### 📝 Content Management (CRUD)
- **Post Engine:** Full Create, Read, Update, and Delete capabilities for developer posts.
- **Engagement:** Optimized logic for real-time Likes and Comments.

### 📡 Real-time Engine
- **Socket.io:** Bidirectional communication for instant messaging and online status tracking.
- **Concurrency:** Built to handle multiple active chat sockets simultaneously.

### ☁️ Media & Cloud Integration
- **Cloudinary:** Cloud-based image management for profile pictures and post media.
- **Multer:** Efficient multi-part form data handling for file uploads.

---

## 🛠 Technical Stack

| Category | Technology |
| :--- | :--- |
| **Runtime Environment** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Real-time** | Socket.io |
| **Media Hosting** | Cloudinary |
| **Authentication** | JSON Web Tokens (JWT) |

---

## 📂 API Architecture

```text
/api/auth     - Signup, Login, Profile Updates, Follow/Unfollow
/api/posts    - Post CRUD, Likes, Comments
/api/messages - Chat history and message storage
/api/users    - Search and User discovery
