# MERN Blog

A full-stack blog application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features
- User authentication (register/login)
- Create, edit, and delete blog posts
- Upload images
- Responsive UI
- RESTful API

## Folder Structure
```
mern-blog/
├── client/                  # React frontend
│   ├── dist/                # Production build output
│   ├── public/              # Static assets
│   │   └── images/
│   ├── src/                 # Source code
│   │   ├── assets/
│   │   ├── components/
│   │   └── services/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                  # Express/Node backend
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Express middleware
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── uploads/             # Uploaded images/files
│   ├── .env                 # Environment variables (not tracked)
│   ├── package.json
│   └── server.js
└── README.md                # Project documentation
```

## Prerequisites
- Node.js (v16+ recommended)
- pnpm (or npm/yarn)
- MongoDB instance (local or cloud)

## Setup Instructions

### 1. Clone the repository
```
git clone https://github.com/PLP-MERN-Stack-Development/week-4-mern-integration-assignment-Brian-Masheti.git
cd week-4-mern-integration-assignment-Brian-Masheti/mern-blog
```

### 2. Install dependencies
#### Client
```
cd client
pnpm install
```
#### Server
```
cd ../server
pnpm install
```

### 3. Environment Variables
Create a `.env` file in the `server/` directory with your MongoDB URI and any other secrets:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
HOST=0.0.0.0
```

### 3.1. Network Access (for multi-device development)
If you want to access your backend or frontend from another device on your local network (e.g., your desktop and laptop), make sure your server binds to all interfaces by setting:
```
HOST=0.0.0.0
```
This allows the server to be accessible from other devices on the same WiFi/network. By default, many setups use `localhost` or `127.0.0.1`, which is only accessible from the same machine.

### 4. Running the Application
#### Start the server
```
cd server
pnpm start
```
#### Start the client
```
cd ../client
pnpm dev
```

The client will typically run on [http://localhost:5173](http://localhost:5173) and the server on [http://localhost:5000](http://localhost:5000).

## Deployment
- The `dist/` folder in the client is included for deployment (e.g., Vercel).
- Ensure environment variables are set in your deployment platform.

## Scripts
- `pnpm dev` (client): Start React development server
- `pnpm build` (client): Build React app for production
- `pnpm start` (server): Start Express server
I also rememer i had t
## API Endpoints

Below are the main API endpoints you can use to interact with the backend. Use tools like Postman to test these routes:

```
MERN-Blog-API

├── POST   /api/categories           # CreateCategory
├── GET    /api/categories           # GetAllCategories
├── POST   /api/posts                # CreatePost
├── GET    /api/posts                # GetAllPosts
├── GET    /api/posts/:id            # GetSinglePost
├── PUT    /api/posts/:id            # UpdatePost
├── DELETE /api/posts/:id            # DeletePost
├── POST   /api/auth/register        # TestRegistration
├── POST   /api/auth/login           # TestLogin
├── POST   /api/upload               # UploadPostImage
```

- Replace `:id` with the actual post ID.
- All POST/PUT endpoints expect JSON bodies unless uploading files (use multipart/form-data for image upload).
- Auth endpoints return a JWT token for protected routes.

