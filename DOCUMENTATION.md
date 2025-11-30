# PickMyTech - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Features](#features)
5. [Installation & Setup](#installation--setup)
6. [API Documentation](#api-documentation)
7. [Database Models](#database-models)
8. [Frontend Components](#frontend-components)
9. [AI & ML Features](#ai--ml-features)
10. [Environment Configuration](#environment-configuration)
11. [Development Workflow](#development-workflow)
12. [Deployment](#deployment)

---

## Project Overview

**PickMyTech** is an intelligent technology recommendation platform built with the MERN stack. It helps users discover the perfect tech devices (phones, laptops, tablets, smartwatches, cameras, headphones) through AI-powered recommendations, comprehensive specifications, device comparisons, and community engagement.

### Key Highlights
- 🤖 **AI-Powered Chatbot** - Maverick AI assistant with LLM integration (Hugging Face)
- 🧠 **ML-Based Recommendations** - TensorFlow.js with Universal Sentence Encoder
- 📊 **Device Comparison** - Side-by-side spec comparison (up to 3 devices)
- 💬 **Community Forum** - User discussions, reviews, and experiences
- 📰 **Tech News** - Automated news fetching with cron jobs
- 🎯 **Personalized Quiz** - User preference profiling for tailored recommendations
- 💰 **Price Tracking** - Multi-source price aggregation
- 🎨 **Premium UI/UX** - Apple-inspired design with Framer Motion animations

---

## Technology Stack

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 14+ | Runtime environment |
| **Express.js** | 4.18.2 | Web application framework |
| **MongoDB** | Latest | NoSQL database |
| **Mongoose** | 8.0.3 | MongoDB ODM |
| **JWT** | 9.0.2 | Authentication & authorization |
| **Socket.io** | 4.5.4 | Real-time communication |
| **Axios** | 1.6.2 | HTTP client for API calls |
| **bcryptjs** | 2.4.3 | Password hashing |
| **Express Validator** | 7.0.1 | Request validation |
| **Node-Cron** | 3.0.3 | Scheduled tasks |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **dotenv** | 16.3.1 | Environment variable management |

### AI/ML Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **TensorFlow.js (Node)** | 4.22.0 | Machine learning runtime |
| **Universal Sentence Encoder** | 1.3.3 | Semantic similarity for recommendations |
| **Hugging Face API** | - | LLM chatbot responses (Phi-3-mini) |

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI library |
| **React Router DOM** | 6.30.1 | Client-side routing |
| **React Scripts** | 5.0.1 | CRA build tooling |
| **Framer Motion** | 10.18.0 | Animation library |
| **Axios** | 1.13.1 | HTTP client |
| **React Icons** | 4.12.0 | Icon library |
| **React Toastify** | 9.1.3 | Toast notifications |
| **Socket.io Client** | 4.8.1 | Real-time client |
| **React Helmet Async** | 2.0.5 | SEO meta tag management |

### Development Tools
- **Concurrently** - Run server & client simultaneously
- **Testing Library** - React component testing
- **Web Vitals** - Performance monitoring

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       CLIENT (React)                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │Components│  │  Context │  │  Utils   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │   HTTP/REST   │
                    │   Socket.io   │
                    └───────┬───────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                   SERVER (Express.js)                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Routes  │  │Middleware│  │ Services │  │  Utils   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                    ┌───────┴───────┐
                    │   Mongoose    │
                    └───────┬───────┘
                            │
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Database                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │ Devices  │  │   News   │  │Community │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Project Structure
```
pick-my-tech/
├── server/                      # Backend application
│   ├── index.js                # Server entry point
│   ├── models/                 # Mongoose models
│   │   ├── User.js            # User schema
│   │   ├── Device.js          # Device schema
│   │   ├── News.js            # News schema
│   │   └── Community.js       # Community post schema
│   ├── routes/                # API routes
│   │   ├── auth.js            # Authentication routes
│   │   ├── devices.js         # Device CRUD routes
│   │   ├── recommendations.js # Recommendation engine
│   │   ├── quiz.js            # Quiz routes
│   │   ├── news.js            # News routes
│   │   ├── chatbot.js         # Chatbot AI routes
│   │   ├── community.js       # Community forum routes
│   │   ├── user.js            # User profile routes
│   │   └── prices.js          # Price tracking routes
│   ├── middleware/            # Express middleware
│   │   └── auth.js           # JWT authentication
│   ├── services/              # Business logic services
│   │   └── mlService.js      # TensorFlow ML service
│   ├── scripts/              # Database seeding & utilities
│   │   ├── seed.js           # Main seed script
│   │   ├── generateDevices.js # Device data generator
│   │   ├── generateCommunity.js # Community posts generator
│   │   └── ...
│   └── utils/                # Utility functions
│
├── client/                    # Frontend application
│   ├── public/               # Static assets
│   └── src/
│       ├── App.js           # Main app component
│       ├── index.js         # React entry point
│       ├── pages/           # Page components
│       │   ├── Home.js
│       │   ├── Devices.js
│       │   ├── DeviceDetail.js
│       │   ├── Compare.js
│       │   ├── News.js
│       │   ├── Community.js
│       │   ├── CommunityPostDetail.js
│       │   ├── Quiz.js
│       │   ├── Recommendations.js
│       │   ├── Profile.js
│       │   ├── Login.js
│       │   └── Register.js
│       ├── components/      # Reusable components
│       │   ├── layout/
│       │   │   └── Navbar.js
│       │   ├── chatbot/
│       │   │   └── Chatbot.js
│       │   └── community/
│       ├── context/        # React Context API
│       │   └── AuthContext.js
│       └── utils/          # Utility functions
│
├── package.json           # Root dependencies
├── README.md             # Project overview
├── DOCUMENTATION.md      # This file
├── DEPLOYMENT.md         # Deployment guide
└── QUICKSTART.md         # Quick start guide
```

---

## Features

### 1. User Authentication & Authorization
- **Registration** - Email/password with validation
- **Login** - JWT-based authentication
- **Protected Routes** - Middleware-protected API endpoints
- **Session Management** - Persistent login with token refresh
- **Social Login Placeholders** - Google, GitHub, Facebook (UI ready)

**Implementation:**
- Backend: `server/routes/auth.js`, `server/middleware/auth.js`
- Frontend: `client/src/pages/Login.js`, `client/src/pages/Register.js`, `client/src/context/AuthContext.js`

### 2. Personalized Quiz System
- **First-Time User Onboarding** - Mandatory quiz for new users
- **Preference Profiling** - Device type, budget, usage, priorities, brand preferences
- **Quiz Completion Tracking** - Stored in user profile
- **Dynamic Recommendations** - Based on quiz answers

**Quiz Questions:**
1. Device type (mobile, laptop, tablet, etc.)
2. Budget range (under $500, $500-$1000, etc.)
3. Usage type (gaming, productivity, photography, video)
4. Priorities (battery, display, storage, performance)
5. Preferred brands (Apple, Samsung, Google, etc.)

**Implementation:**
- Backend: `server/routes/quiz.js`
- Frontend: `client/src/pages/Quiz.js`
- Model: `server/models/User.js` (quizCompleted, quizAnswers fields)

### 3. Intelligent Recommendation System

#### A. Rule-Based Recommendations
- **Multi-Factor Scoring Algorithm** (100-point scale):
  - Budget Match: 30% weight
  - Brand Preference: 15% weight
  - Usage Type Compatibility: 25% weight
  - Priority Alignment: 20% weight
  - Device Type Match: 10% weight
- **Personalized Rankings** - Devices scored and sorted
- **Top 10 Results** - Best matches displayed

#### B. ML-Based Recommendations (NEW)
- **TensorFlow.js Integration** - Universal Sentence Encoder
- **Semantic Similarity** - Cosine similarity between user profile and device descriptions
- **Content-Based Filtering** - Matches user needs with device specs
- **Fallback Mechanism** - Falls back to rule-based if ML fails

**Implementation:**
- Backend: `server/routes/recommendations.js`, `server/services/mlService.js`
- Frontend: `client/src/pages/Recommendations.js`

### 4. Maverick AI Chatbot

#### Core Capabilities
- **Navigation Assistance** - "Go to Compare", "Open News"
- **Device Search** - "Find laptops under $1000", "Show Samsung phones"
- **Spec Queries** - "Tell me about iPhone 15"
- **Comparisons** - "Compare iPhone 15 vs Samsung S24"
- **News Updates** - "Latest tech news"
- **Community Navigation** - "Open forum"
- **Help Menu** - "Help", "?"

#### Advanced Features
- **LLM Integration** - Hugging Face Inference API (Phi-3-mini-4k-instruct)
- **Contextual Responses** - Understands natural language queries
- **Smart Actions** - Navigation, search filters, device recommendations
- **Suggestion Chips** - Context-aware follow-up suggestions
- **Model Loading Retry** - Automatic retry with exponential backoff
- **Graceful Fallback** - Rule-based responses if LLM unavailable

**Implementation:**
- Backend: `server/routes/chatbot.js`
- Frontend: `client/src/components/chatbot/Chatbot.js`
- AI: Hugging Face API (microsoft/Phi-3-mini-4k-instruct)

### 5. Device Database & Search
- **Comprehensive Device Catalog** - Phones, laptops, tablets, smartwatches, cameras, headphones
- **Detailed Specifications** - Processor, RAM, storage, camera, battery, display, connectivity
- **Advanced Filtering** - Category, brand, price range, specs
- **Search Functionality** - Name-based device search
- **Brand Listing** - Browse by manufacturer
- **Category Listing** - Browse by device type

**Device Fields:**
- name, brand, category, description
- specifications (processor, memory, camera, battery, display, connectivity)
- prices (array with source, price, currency, lastUpdated)
- images (array of image URLs)
- releaseDate, ratings

**Implementation:**
- Backend: `server/routes/devices.js`, `server/models/Device.js`
- Frontend: `client/src/pages/Devices.js`, `client/src/pages/DeviceDetail.js`

### 6. Device Comparison Tool
- **Multi-Device Comparison** - Compare up to 3 devices side-by-side
- **Same-Type Enforcement** - Only compare devices of the same category
- **Spec-by-Spec Breakdown** - All specifications in tabular format
- **Price Comparison** - Multi-source pricing
- **Visual Comparison** - Side-by-side images

**Implementation:**
- Backend: `server/routes/devices.js` (POST /api/devices/compare)
- Frontend: `client/src/pages/Compare.js`

### 7. Tech News Section
- **Automated News Fetching** - News API integration
- **Scheduled Updates** - Cron job runs daily at 2 AM
- **Initial Fetch** - Server startup fetch (5-second delay)
- **News Storage** - MongoDB persistence
- **News Display** - Sorted by publish date
- **External Links** - Opens in new tabs

**Implementation:**
- Backend: `server/routes/news.js`, `server/models/News.js`
- Cron: `server/index.js` (lines 88-107)
- Frontend: `client/src/pages/News.js`

### 8. Community Forum
- **User Posts** - Create, read, update, delete discussions
- **Like System** - Like/unlike posts
- **User Attribution** - Author names displayed
- **Timestamp Tracking** - Created/updated dates
- **Protected Actions** - Authentication required for posting
- **Post Categories** - General, Review, Question, Discussion

**Implementation:**
- Backend: `server/routes/community.js`, `server/models/Community.js`
- Frontend: `client/src/pages/Community.js`, `client/src/pages/CommunityPostDetail.js`

### 9. User Profile Management
- **Profile View** - Display user info, quiz results, preferences
- **Favorites** - Save favorite devices (placeholder)
- **Quiz Retake** - Re-take quiz to update preferences (placeholder)
- **Password Change** - Update password (placeholder)

**Implementation:**
- Backend: `server/routes/user.js`
- Frontend: `client/src/pages/Profile.js`

### 10. Price Tracking
- **Multi-Source Pricing** - Aggregate prices from multiple retailers
- **Price History** - Track price changes over time (ready for expansion)
- **Lowest Price Highlighting** - Display best available price
- **Source Attribution** - Show where prices come from

**Implementation:**
- Backend: `server/routes/prices.js`
- Model: Device prices array

### 11. Real-Time Features
- **Socket.io Integration** - WebSocket server
- **Room System** - Join/leave rooms
- **Live Updates** - Real-time notifications (expandable)
- **Connection Management** - User connect/disconnect tracking

**Implementation:**
- Backend: `server/index.js` (Socket.io server setup)
- Frontend: Socket.io client connection

### 12. Premium UI/UX
- **Apple-Inspired Design** - Clean, modern interface
- **Framer Motion Animations** - Smooth page transitions, card animations
- **Glassmorphism Effects** - Frosted glass aesthetic
- **Responsive Design** - Mobile, tablet, desktop support
- **Dark Theme** - Consistent color scheme
- **Toast Notifications** - User feedback for actions

**Implementation:**
- CSS: Individual component CSS files
- Animations: Framer Motion in components
- Icons: React Icons

---

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn
- (Optional) Hugging Face API Key for chatbot LLM
- (Optional) News API Key for tech news

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd pick-my-tech
```

### Step 2: Install Dependencies
```bash
# Install root dependencies (concurrently)
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Step 3: Environment Configuration

Create `.env` file in **root directory**:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/pickmytech
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
NEWS_API_KEY=your_news_api_key_from_newsapi_org
HUGGINGFACE_API_KEY=your_huggingface_api_key
```

> **Note:** If `HUGGINGFACE_API_KEY` is not set or contains "PLACEHOLDER", the chatbot will use rule-based responses only.

### Step 4: Seed Database
```bash
cd server
node scripts/seed.js
```

This will populate:
- Sample devices (phones, laptops, tablets, smartwatches, cameras, headphones)
- Sample community posts
- Sample news articles

### Step 5: Run Application

**Option A: Run Both (Recommended)**
```bash
# From root directory
npm run dev
```

**Option B: Run Separately**
```bash
# Terminal 1 - Backend
cd server
npm run dev   # or: node index.js

# Terminal 2 - Frontend
cd client
npm start
```

### Step 6: Access Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001
- **API Health:** http://localhost:5001/api/health

---

## API Documentation

### Base URL
- Development: `http://localhost:5001/api`
- Production: `<your-domain>/api`

### Authentication
Protected endpoints require JWT token in `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

---

### Auth Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "quizCompleted": false
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

### Device Routes (`/api/devices`)

#### Get All Devices (with filters)
```http
GET /api/devices?category=mobile&brand=Apple&minPrice=500&maxPrice=1500
```

**Query Parameters:**
- `category` - mobile, laptop, tablet, smartwatch, camera, headphones
- `brand` - Apple, Samsung, Google, etc.
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `search` - Search by name

**Response:**
```json
{
  "success": true,
  "devices": [...]
}
```

#### Get Device by ID
```http
GET /api/devices/:id
```

#### Get All Brands
```http
GET /api/devices/brands/list
```

#### Get All Categories
```http
GET /api/devices/categories/list
```

#### Compare Devices
```http
POST /api/devices/compare
Content-Type: application/json

{
  "deviceIds": ["device_id_1", "device_id_2", "device_id_3"]
}
```

---

### Recommendation Routes (`/api/recommendations`)

#### Get Personalized Recommendations (Auth Required)
```http
POST /api/recommendations
Authorization: Bearer <token>
```

Uses user's quiz answers for recommendations.

**Response:**
```json
{
  "success": true,
  "recommendations": [...],
  "scores": [
    { "device": {...}, "score": 85 }
  ]
}
```

#### Quick Recommendations (No Auth)
```http
POST /api/recommendations/quick
Content-Type: application/json

{
  "deviceType": "mobile",
  "budgetRange": "500-1000",
  "usageType": ["gaming", "photography"],
  "priorities": ["performance", "camera"]
}
```

Uses ML-based semantic matching if available, falls back to rule-based.

---

### Quiz Routes (`/api/quiz`)

#### Submit Quiz Answers
```http
POST /api/quiz
Authorization: Bearer <token>
Content-Type: application/json

{
  "deviceType": "mobile",
  "budgetRange": "500-1000",
  "usageType": ["gaming", "photography"],
  "priorities": ["performance", "camera", "battery"],
  "preferredBrands": ["Apple", "Samsung"]
}
```

#### Get Quiz Status
```http
GET /api/quiz/status
Authorization: Bearer <token>
```

---

### News Routes (`/api/news`)

#### Get All News
```http
GET /api/news
```

#### Get News by ID
```http
GET /api/news/:id
```

#### Fetch News (Admin/Cron)
```http
POST /api/news/fetch
```

---

### Chatbot Routes (`/api/chatbot`)

#### Send Message to Maverick
```http
POST /api/chatbot
Content-Type: application/json

{
  "message": "Find me a laptop under $1000"
}
```

**Response:**
```json
{
  "success": true,
  "response": "I've set up a search for you...",
  "action": "search",
  "data": {
    "category": "laptop",
    "maxPrice": 1000
  },
  "suggestions": ["Show laptops", "Refine search", "Home"],
  "timestamp": "2023-11-30T..."
}
```

---

### Community Routes (`/api/community`)

#### Get All Posts
```http
GET /api/community
```

#### Create Post (Auth Required)
```http
POST /api/community
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Best phone under $800?",
  "content": "Looking for recommendations...",
  "category": "Question"
}
```

#### Get Post by ID
```http
GET /api/community/:id
```

#### Like/Unlike Post (Auth Required)
```http
POST /api/community/:id/like
Authorization: Bearer <token>
```

---

### User Routes (`/api/user`)

#### Get User Profile
```http
GET /api/user/profile
Authorization: Bearer <token>
```

---

### Price Routes (`/api/prices`)

#### Get Prices for Device
```http
GET /api/prices/:deviceId
```

---

## Database Models

### User Model
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  quizCompleted: Boolean (default: false),
  quizAnswers: {
    deviceType: String,
    budgetRange: String,
    usageType: [String],
    priorities: [String],
    preferredBrands: [String]
  },
  favorites: [ObjectId], // Device references
  createdAt: Date,
  updatedAt: Date
}
```

### Device Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  brand: String (required),
  category: String (enum: mobile, laptop, tablet, smartwatch, camera, headphones),
  description: String,
  specifications: {
    processor: {
      name: String,
      cores: Number,
      clockSpeed: String
    },
    memory: {
      ram: String,
      storage: String,
      expandable: Boolean
    },
    camera: {
      rear: String,
      front: String,
      video: String
    },
    battery: {
      capacity: String,
      charging: String,
      wireless: Boolean
    },
    display: {
      size: String,
      resolution: String,
      type: String,
      refreshRate: String
    },
    connectivity: {
      wifi: String,
      bluetooth: String,
      nfc: Boolean,
      ports: [String]
    }
  },
  prices: [{
    source: String,
    price: Number,
    currency: String (default: 'USD'),
    lastUpdated: Date,
    url: String
  }],
  images: [String],
  releaseDate: Date,
  ratings: {
    average: Number,
    count: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### News Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  content: String,
  source: String,
  author: String,
  url: String,
  image: String,
  publishedAt: Date,
  category: String,
  createdAt: Date
}
```

### Community Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  content: String (required),
  author: ObjectId (User reference, required),
  category: String (enum: General, Review, Question, Discussion),
  likes: [ObjectId], // User references
  comments: [{
    user: ObjectId,
    content: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Frontend Components

### Pages
| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with hero section |
| Devices | `/devices` | Device listing with filters |
| DeviceDetail | `/devices/:id` | Individual device specifications |
| Compare | `/compare` | Side-by-side device comparison |
| News | `/news` | Tech news listing |
| Community | `/community` | Forum posts listing |
| CommunityPostDetail | `/community/:id` | Individual post view |
| Quiz | `/quiz` | Personalized quiz (first-time users) |
| Recommendations | `/recommendations` | Personalized device suggestions |
| Profile | `/profile` | User profile & preferences |
| Login | `/login` | User login |
| Register | `/register` | User registration |

### Components
| Component | Location | Description |
|-----------|----------|-------------|
| Navbar | `components/layout/Navbar.js` | Top navigation bar with auth state |
| Chatbot | `components/chatbot/Chatbot.js` | Floating AI assistant |

### Context
| Context | Purpose |
|---------|---------|
| AuthContext | Global user authentication state, login/logout functions |

---

## AI & ML Features

### 1. TensorFlow.js ML Service
**Location:** `server/services/mlService.js`

**Technology:**
- TensorFlow.js Node (@tensorflow/tfjs-node)
- Universal Sentence Encoder (@tensorflow-models/universal-sentence-encoder)

**Functionality:**
- **Semantic Embeddings** - Converts text to 512-dimensional vectors
- **Cosine Similarity** - Measures similarity between user needs and device specs
- **Content-Based Filtering** - Matches user profile with device descriptions
- **Batch Processing** - Efficient embedding generation for multiple items

**Usage:**
```javascript
const recommendations = await mlService.findTopMatches(
  userProfile,  // "I want a mobile for gaming and photography..."
  devices,      // Array of device objects
  (device) => `${device.name}. ${device.description}. ${specs}...`
);
```

**Returns:** Sorted array of `{ item, score }` objects

### 2. Hugging Face LLM Integration
**Location:** `server/routes/chatbot.js`

**Model:** microsoft/Phi-3-mini-4k-instruct (via Hugging Face Inference API)

**Features:**
- Natural language understanding
- Context-aware responses
- Automatic retry on model loading (503 errors)
- Fallback to rule-based responses

**Configuration:**
```env
HUGGINGFACE_API_KEY=hf_xxxxxxxxxxxxx
```

**Response Flow:**
1. Rule-based pattern matching (navigation, device search, etc.)
2. If no match → Call Hugging Face API
3. If API fails → Default fallback message

---

## Environment Configuration

### Required Variables
```env
# Server
PORT=5001

# Database
MONGODB_URI=mongodb://localhost:27017/pickmytech

# Authentication
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# CORS
CLIENT_URL=http://localhost:3000
```

### Optional Variables
```env
# News API (for tech news fetching)
NEWS_API_KEY=your_newsapi_org_key

# Hugging Face (for LLM chatbot)
HUGGINGFACE_API_KEY=hf_xxxxxxxxxx
```

### Client Proxy
The client is configured to proxy API requests to the backend:

**File:** `client/package.json`
```json
{
  "proxy": "http://localhost:5001"
}
```

This allows frontend to make requests to `/api/...` which are forwarded to `http://localhost:5001/api/...`.

---

## Development Workflow

### Running Locally
```bash
# Terminal 1: Start server
cd server
npm run dev

# Terminal 2: Start client
cd client
npm start

# OR: Run both concurrently from root
npm run dev
```

### Database Seeding
```bash
cd server
node scripts/seed.js
```

**Available Seed Scripts:**
- `seed.js` - Main seeding (devices, community, news)
- `generateDevices.js` - Device data generator
- `generateCommunity.js` - Community posts generator
- `allDevices.js` - Sample device data
- `deviceGenerator.js` - Advanced device generation

### Adding New Devices
```bash
cd server
node scripts/generateDevices.js
```

### Scheduled Tasks
**News Fetch Cron Job:**
- **Schedule:** Daily at 2:00 AM
- **Location:** `server/index.js` (line 88)
- **Manual Trigger:** `POST /api/news/fetch`

### Testing
```bash
# Client tests
cd client
npm test
```

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment Checklist
- [ ] Set production environment variables
- [ ] Change JWT_SECRET
- [ ] Configure MongoDB Atlas or production database
- [ ] Set up News API account (if using news feature)
- [ ] Set up Hugging Face account (if using LLM chatbot)
- [ ] Build client: `cd client && npm run build`
- [ ] Deploy backend to hosting (Heroku, Railway, DigitalOcean, etc.)
- [ ] Deploy frontend to hosting (Vercel, Netlify, etc.) or serve from backend
- [ ] Configure CORS for production domains
- [ ] Set up SSL/TLS certificates
- [ ] Configure DNS

---

## Advanced Features & Customization

### Adding New Device Categories
1. Add category to Device model enum (`server/models/Device.js`)
2. Update seed scripts with new category data
3. Update chatbot category detection (`server/routes/chatbot.js`)
4. Add category filters to frontend (`client/src/pages/Devices.js`)

### Customizing Recommendation Algorithm
**Location:** `server/routes/recommendations.js`

Adjust weights in `calculateScore()` function:
```javascript
// Current weights
Budget Match: 30%
Brand Preference: 15%
Usage Type Compatibility: 25%
Priority Alignment: 20%
Device Type Match: 10%
```

### Adding Social Login
Placeholders exist in UI. Implement:
1. Backend: OAuth routes (Google, GitHub, Facebook)
2. Frontend: OAuth redirect handlers
3. Environment: OAuth client IDs and secrets

### Extending Community Features
- Add comments (schema already has comments array)
- Add voting system (already has likes array)
- Add user reputation points
- Add post categories/tags

---

## Performance Optimization

### Current Optimizations
- **Database Indexing** - User email/username, device category/brand
- **Pagination** - Ready for implementation on large datasets
- **Caching** - ML model loaded once and reused
- **Batch Processing** - TensorFlow batch embedding generation
- **Connection Pooling** - Mongoose default connection pool

### Recommended Production Optimizations
- Enable MongoDB indexes on frequently queried fields
- Implement Redis caching for recommendations
- Add CDN for static assets
- Implement image optimization (next-gen formats, lazy loading)
- Enable compression middleware (gzip)
- Implement API rate limiting
- Add database query optimization (select specific fields)

---

## Security Considerations

### Current Security Measures
- **Password Hashing** - bcryptjs (10 rounds)
- **JWT Authentication** - Secure token-based auth
- **CORS** - Configured for client URL
- **Input Validation** - Express Validator on routes
- **MongoDB Injection Prevention** - Mongoose sanitization

### Production Security Checklist
- [ ] Use HTTPS/SSL in production
- [ ] Implement rate limiting (express-rate-limit)
- [ ] Add helmet.js for security headers
- [ ] Sanitize user inputs (express-mongo-sanitize)
- [ ] Implement CSRF protection
- [ ] Add API request logging
- [ ] Set up monitoring and alerts
- [ ] Regular dependency updates (npm audit)
- [ ] Environment variable protection (.env in .gitignore)

---

## Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Solution: Ensure MongoDB is running locally or check connection string
```

**2. Port Already in Use**
```bash
# Kill process on port 5001 (macOS/Linux)
pkill -f "node server/index.js"

# Or in .env, change PORT to different value
```

**3. ML Model Loading Fails**
```
Issue: TensorFlow.js requires compatible Node.js version
Solution: Ensure Node.js v14+ is installed
Fallback: Recommendations will use rule-based algorithm
```

**4. Hugging Face API 503 Errors**
```
Issue: Model is loading (cold start)
Solution: Chatbot has automatic retry with backoff
Fallback: Rule-based responses if retries fail
```

**5. News Not Fetching**
```
Issue: Missing or invalid NEWS_API_KEY
Solution: Get free API key from newsapi.org
```

---

## Contributing

### Development Guidelines
1. Follow existing code structure
2. Add comments for complex logic
3. Test before committing
4. Use meaningful commit messages
5. Update documentation for new features

### Code Style
- **Backend:** Node.js/Express conventions
- **Frontend:** React hooks, functional components
- **CSS:** Component-scoped styles (ComponentName.css)

---

## License

This project is open source and available under the MIT License.

---

## Credits & Acknowledgments

- **Design Inspiration:** Apple Inc.
- **Icons:** React Icons
- **Animations:** Framer Motion
- **ML:** TensorFlow.js, Hugging Face
- **API:** News API

---

## Support & Contact

For issues, questions, or contributions, please open an issue on the project repository.

---

**Last Updated:** November 30, 2025
**Version:** 1.0.0
**Author:** Portfolio Project
