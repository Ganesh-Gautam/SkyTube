
# SkyTube - Full-Stack Video Sharing Platform

A modern, feature-rich video sharing platform similar to YouTube, built with the MERN stack (MongoDB, Express, React, Node.js).

---

## Index

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Running the Application](#-running-the-application)

---

## Features

### Authentication & User Management
- User registration with email/password
- JWT-based authentication (access + refresh tokens)
- Secure password hashing with bcrypt
- Avatar and cover image upload
- User profile management
- Session management with automatic token refresh

### Video Management
- Video upload with drag & drop support
- Custom thumbnail upload
- Video player with controls
- Video metadata (title, description, duration)
- Publish/unpublish videos
- Edit video details
- Delete videos
- View count tracking

### User Channels
- Public channel pages
- Channel customization (avatar, cover image, description)
- Channel videos tab
- Channel community tab
- Channel studio for content management
- Subscriber count display

### Comments & Engagement
- Add, edit, and delete comments
- Nested replies to comments
- Like/unlike videos
- Like/unlike comments
- Real-time comment count
- Comment sorting options

### Subscriptions
- Subscribe/unsubscribe to channels
- Subscriber count tracking
- Subscriptions feed (videos from subscribed channels)
- Subscription status indicators
- Subscribed channels list

### Community Posts (Twitter-like)
- Create text-based community posts
- Channel community tab
- Like/unlike posts
- Edit and delete own posts
- Chronological feed

### Playlists
- Create custom playlists
- Add/remove videos from playlists
- Edit playlist details (name, description)
- Delete playlists
- Public and private playlists
- Playlist video count and total duration

### Search & Discovery
- Search videos by title and description
- Advanced filtering (date, duration, sort options)
- Search suggestions
- Recent search history
- Trending videos

### User Activity
- Watch history tracking
- Liked videos collection
- Clear watch history
- Remove from liked videos
- Activity timeline

### UI/UX Features
- Dark/Light theme toggle
- Responsive design (mobile, tablet, desktop)
- Infinite scroll pagination
- Loading skeletons
- Optimistic UI updates
- Image lazy loading
- Smooth animations and transitions
- Toast notifications
- Error boundaries

---

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications
- **Cloudinary** - Media hosting (images & videos)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary SDK** - Media upload
- **Cookie-parser** - Cookie handling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### DevOps & Tools
- **Git** - Version control
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Postman** - API testing 

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (v6.0 or higher) - Local or Atlas cloud
- **Git** for version control
- **Cloudinary Account** (for media uploads)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Ganesh-Gautam/SkyTube.git
cd SkyTube
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
nano .env
```

---

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=7000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/SkyTube
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/SkyTube

# CORS
CORS_ORIGIN=http://localhost:7000

# JWT Secrets
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here
REFRESH_TOKEN_EXPIRY=10d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```


## Running the Application

### Development Mode

#### Backend Server

```bash
# From backend directory
cd chaiAurBackend

# Start development server with nodemon
npm run dev

# Server will run on http://localhost:7000
```

#### Frontend Server

```bash
# From frontend directory
cd chaiAurFrontend

# Start Vite dev server
npm run dev

# App will run on http://localhost:5173
```


---

**Built with ❤️ using MERN Stack**