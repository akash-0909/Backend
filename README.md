<div align="center">

# 🎬 Streamify — Video Platform Engine
*A scalable, high-performance MERN backend built for modern media streaming.*

![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![ExpressJS](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

[Report Issue](https://github.com/akash-0909/Backend/issues) · [Request Feature](https://github.com/akash-0909/Backend/issues)

</div>

---

## 💡 The Problem & Solution

Building a video platform requires more than basic CRUD operations. Handling video file storage, secure stream delivery, subscriber relationships, and real-time interaction feeds (likes, comments, history) demands a robust database design and efficient query architecture.

**Streamify Backend** solves this by leveraging **MongoDB Aggregation Pipelines** to deliver high-speed, paginated user feeds alongside a dual-token JWT authentication system for maximum security.

---

## 🔥 Key Engineering Highlights

* 🔐 **Production-Grade Auth:** Implemented access & refresh token rotation using JWT with HTTP-only cookies and `bcrypt` password hashing.
* ⚡ **Optimized Queries:** Replaced expensive multi-query operations with complex MongoDB aggregation pipelines for watch history, channel analytics, and subscriber feeds.
* ☁️ **Cloud Storage Integration:** Built a multi-part file handling pipeline using **Multer** and **Cloudinary** for video processing and dynamic thumbnail management.
* 🛡️ **Robust REST Architecture:** Standardized API responses, custom middleware for auth verification, and centralized error handling across all controllers.

---

## ⚡ System Architecture & Features

| Feature | Description | Tech Used |
| :--- | :--- | :--- |
| **Authentication** | Access/Refresh Token cycle, session revocation | JWT, Bcrypt |
| **Media Pipeline** | Asynchronous cloud uploads for video & thumbnails | Multer, Cloudinary |
| **Social Graph** | Subscriptions, channel stats, like/dislike counts | Aggregation Pipelines |
| **Content Operations** | Playlists, nested comment trees, persistent watch history | MongoDB, Mongoose |

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (with Mongoose ODM)
* **Auth & Security:** JSON Web Tokens (JWT), Bcrypt
* **Storage Engine:** Cloudinary API, Multer

---

## 🚦 Quick Start Guide

### Prerequisites
* Node.js (v18+)
* MongoDB Atlas connection string
* Cloudinary API Keys

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/akash-0909/Backend.git](https://github.com/akash-0909/Backend.git)
   cd Backend
