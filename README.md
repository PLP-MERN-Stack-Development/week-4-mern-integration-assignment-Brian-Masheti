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
```

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

