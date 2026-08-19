<div align="center">

# 🎬 Video Streaming Platform (Backend)

A robust, scalable backend REST API for a YouTube-style video-sharing platform built with Node.js, Express.js, and MongoDB. Features secure JWT authentication, Cloudinary media management, and complex aggregation pipelines.

[Report Bug](https://github.com/akash0909/Backend/issues) · [Request Feature](https://github.com/akash0909/Backend/issues)

</div>

---

## 🚀 Overview

This repository houses the core server-side architecture for a full-featured video platform. It handles full user authentication, high-performance media uploads, optimized database queries for playlists and subscriptions, and comprehensive interaction tracking (likes, comments, and watch history).

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **Authentication:** JWT (JSON Web Tokens), `bcrypt`
* **File Handling & Cloud Storage:** Multer, Cloudinary

## ✨ Key Features

* **Secure Authentication:** User sign-up, sign-in, session handling via JWT, and encrypted password storage.
* **Media Management:** Direct image and video uploads powered by Multer and integrated with Cloudinary cloud storage.
* **Optimized Database Queries:** Advanced MongoDB aggregation pipelines for efficient video pagination, search indexing, and feed generation.
* **Core Platform APIs:** Full RESTful routes for user profiles, video likes, nested comments, custom playlists, subscriptions, and watch history tracking.

## ⚙️ Quick Start

### Prerequisites
* [Node.js](https://nodejs.org/) (v16 or higher)
* [MongoDB](https://www.mongodb.com/) (Local or Atlas instance)
* [Cloudinary](https://cloudinary.com/) Account (for API keys)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/akash0909/Backend.git](https://github.com/akash0909/Backend.git)
   cd Backend
