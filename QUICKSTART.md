# Quick Start Guide - PickMyTech

Get PickMyTech up and running in minutes!

## Prerequisites Check

Ensure you have:
- ✅ Node.js (v14+) installed: `node --version`
- ✅ npm installed: `npm --version`
- ✅ MongoDB running locally OR MongoDB Atlas account

## Step-by-Step Setup

### 1. Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Option B: MongoDB Atlas (Cloud)**
- Go to https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Use it in step 3

### 2. Install Dependencies

From the project root:
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment

Create `server/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pickmytech
# OR for Atlas: mongodb+srv://username:password@cluster.mongodb.net/pickmytech

JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### 4. Seed the Database

```bash
cd server
npm run seed
```

This will create sample devices and news articles.

### 5. Start the Application

**Option A: Run Both Together (Recommended)**
```bash
# From root directory
npm run dev
```

**Option B: Run Separately**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

### 6. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## First Steps

1. **Register an Account**
   - Go to http://localhost:3000
   - Click "Sign Up"
   - Fill in your details

2. **Complete the Quiz**
   - After registration, you'll be redirected to the quiz
   - Answer questions about your preferences
   - This helps generate personalized recommendations

3. **Explore Features**
   - Browse devices with filters
   - Get personalized recommendations
   - Read tech news
   - Chat with Maverick (bottom right)
   - Join the community

## Troubleshooting

### MongoDB Connection Error
```
Error: MongoDB connection error
```
**Solution**: 
- Ensure MongoDB is running: `mongod --version`
- Check MONGODB_URI in `.env` file
- For Atlas: Verify IP whitelist and credentials

### Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution**: 
- Change PORT in `server/.env`
- Or kill process using port: `lsof -ti:5000 | xargs kill`

### Module Not Found
```
Error: Cannot find module 'xyz'
```
**Solution**: 
- Run `npm install` in the appropriate directory
- Delete `node_modules` and `package-lock.json`, then reinstall

### CORS Errors
**Solution**: 
- Ensure CLIENT_URL in `.env` matches your frontend URL
- Check browser console for exact error

### Quiz Not Showing After Registration
**Solution**: 
- Check browser console for errors
- Verify backend is running
- Clear browser cache and localStorage

## Testing the Setup

### Test Backend
```bash
curl http://localhost:5000/api/health
# Should return: {"status":"OK","message":"PickMyTech API is running"}
```

### Test Devices API
```bash
curl http://localhost:5000/api/devices
# Should return list of devices
```

### Test Frontend
- Open http://localhost:3000
- Check browser console for errors (F12)
- Verify all pages load correctly

## Default Test Account

You can create a test account:
- Email: test@example.com
- Password: password123
- Complete the quiz to see recommendations

## Next Steps

1. **Customize Data**: Edit `server/scripts/seed.js` to add your own devices
2. **Add Features**: Explore the codebase and add new features
3. **Deploy**: Follow DEPLOYMENT.md for production deployment
4. **Enhance Chatbot**: Add OpenAI API key for smarter responses

## Need Help?

- Check the README.md for detailed documentation
- Review DEPLOYMENT.md for production setup
- Check browser console and terminal for error messages
- Ensure all dependencies are installed correctly

## Common Commands

```bash
# Start development (both server and client)
npm run dev

# Start only server
cd server && npm run dev

# Start only client
cd client && npm start

# Seed database
cd server && npm run seed

# Build for production
cd client && npm run build
```

---

**Happy Coding! 🚀**

