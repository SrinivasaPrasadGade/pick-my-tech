# PickMyTech - Intelligent Technology Recommendation Platform

PickMyTech is a comprehensive MERN stack application that helps users find the perfect mobile phones, laptops, and other tech devices through intelligent recommendations, detailed specifications, and a vibrant community.

## 🌟 Features

### Core Features
- **Intelligent Recommendation System**: AI-powered recommendations based on user preferences, usage patterns, and budget
- **Comprehensive Device Database**: Detailed specifications for mobile phones, laptops, tablets, smartwatches, and more
- **Interactive Quiz**: Personalized questionnaire on signup to understand user needs
- **Maverick Chatbot**: Intelligent assistant that helps users navigate and find devices
- **Tech News Section**: Real-time technology news and updates
- **Community Forum**: User discussions, reviews, and experiences
- **Advanced Filters**: Search and filter devices by category, brand, price, and specifications
- **Price Comparison**: Real-time pricing from multiple e-commerce sources
- **Feature Explanations**: Educational content explaining technical specifications

### Unique Features
- **Apple-like UI/UX**: Smooth, modern interface inspired by Apple's design language
- **Real-time Data**: Up-to-date device information and pricing
- **Smart Suggestions**: Context-aware recommendations based on multiple factors
- **User Profiles**: Save favorites, track preferences, and manage recommendations
- **Multiple Login Options**: Email/password, Google, GitHub, Facebook (placeholder implementations)

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Socket.io** for real-time features
- **Axios** for API calls

### Frontend
- **React 18** with React Router
- **Framer Motion** for animations
- **Axios** for API communication
- **React Icons** for icons
- **React Toastify** for notifications

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd pick-my-tech
```

2. **Install dependencies**
```bash
# Install root dependencies (optional, for concurrently)
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Configure Environment Variables**

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pickmytech
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
NEWS_API_KEY=your_news_api_key
OPENAI_API_KEY=your_openai_api_key
```

4. **Seed the Database**

Run the seed script to populate initial data:
```bash
cd server
node scripts/seed.js
```

5. **Run the Application**

From the root directory:
```bash
# Run both server and client concurrently
npm run dev
```

Or run them separately:
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
pick-my-tech/
├── server/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utility functions
│   ├── scripts/         # Seed scripts
│   └── index.js         # Server entry point
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── App.js       # Main app component
│   └── public/          # Static files
└── README.md
```

## 🚀 Usage

### For Users

1. **Register/Login**: Create an account or sign in
2. **Complete Quiz**: First-time users will be prompted to complete a quiz
3. **Browse Devices**: Explore devices with advanced filters
4. **Get Recommendations**: View personalized recommendations based on quiz answers
5. **Read News**: Stay updated with latest tech news
6. **Join Community**: Share experiences and ask questions
7. **Use Maverick**: Chat with the AI assistant for help

### For Developers

- API endpoints are documented in `/api/` routes
- Models are defined in `server/models/`
- Components are organized by feature in `client/src/components/`

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Devices
- `GET /api/devices` - Get all devices (with filters)
- `GET /api/devices/:id` - Get device details
- `GET /api/devices/brands/list` - Get all brands
- `GET /api/devices/categories/list` - Get all categories
- `POST /api/devices/compare` - Compare devices

### Recommendations
- `POST /api/recommendations` - Get personalized recommendations (auth required)
- `POST /api/recommendations/quick` - Quick recommendations (no auth)

### Quiz
- `POST /api/quiz` - Submit quiz answers
- `GET /api/quiz/status` - Get quiz status

### News
- `GET /api/news` - Get all news
- `GET /api/news/:id` - Get news details

### Chatbot
- `POST /api/chatbot` - Send message to Maverick

### Community
- `GET /api/community` - Get all posts
- `POST /api/community` - Create post (auth required)
- `GET /api/community/:id` - Get post details
- `POST /api/community/:id/like` - Like/unlike post

## 🎨 Key Features Explained

### Recommendation Algorithm
The recommendation system uses a scoring algorithm that considers:
- Budget match (30% weight)
- Brand preference (15% weight)
- Usage type compatibility (25% weight)
- Priority alignment (20% weight)
- Device type match (10% weight)

### Maverick Chatbot
Maverick is a rule-based chatbot that:
- Helps users navigate the application
- Provides device recommendations
- Answers common questions
- Suggests actions based on user queries

(Can be enhanced with OpenAI API for more intelligent responses)

## 🔮 Future Enhancements

- Integration with real e-commerce APIs (Amazon, Best Buy)
- Enhanced AI recommendations using machine learning
- Real-time price tracking and alerts
- User reviews and ratings system
- Advanced comparison tools
- Wishlist and price drop notifications
- Social sharing features
- Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 👤 Author

Built as a portfolio project demonstrating full-stack development skills.

## 🙏 Acknowledgments

- Design inspiration from Apple's website
- UI components and icons from React Icons
- Animation library: Framer Motion

---

**Note**: This is a prototype/proof-of-concept. For production use, additional security measures, error handling, and optimizations would be needed.

