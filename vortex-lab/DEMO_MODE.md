# Demo Mode

KIITConnect includes a **Demo Mode** that allows you to test the application without setting up Firebase or Google OAuth.

## How Demo Mode Works

- **Automatic Detection**: If Firebase environment variables are not configured or are set to demo values, the app automatically runs in demo mode
- **Mock Google OAuth**: Simulates Google authentication without requiring real Google accounts
- **Mock Authentication**: Uses localStorage to simulate user authentication
- **Realistic Experience**: Provides a full experience with mock data that feels like the real app
- **No External Dependencies**: Works completely offline after initial load

## Demo Mode Features

### ✅ What Works in Demo Mode:

- Email/password authentication with KIIT validation
- User registration with roll number and course detection
- Session persistence across browser refreshes
- All UI components and navigation
- Mock user data (study hours, streak, rank, etc.)
- Automatic KIIT user profile creation

### ❌ What Doesn't Work in Demo Mode:

- Real-time data synchronization
- Cross-device session sharing
- Actual data persistence (cleared when localStorage is cleared)
- Push notifications
- Real user interactions between different accounts

## How to Use Demo Mode

1. **No Setup Required**: Just run the app normally without Firebase configuration
2. **Login or Sign Up**:
   - **Login**: Enter any @kiit.ac.in email and any password
   - **Sign Up**: Fill the registration form with KIIT details
3. **Test All Features**: Explore the complete app with realistic mock data

## Authentication Method

### 📧 KIIT Email + Password Authentication

- **Login**: Use any email ending with @kiit.ac.in with any password
- **Sign Up**: Complete registration form with KIIT details
- **Demo Examples**:
  - Email: `john.doe@kiit.ac.in` | Password: `password123`
  - Email: `test.student@kiit.ac.in` | Password: `mypassword`
  - Email: `your.name@kiit.ac.in` | Password: `anything`

## Demo User Profile

When you use demo mode, you'll automatically get:

### Simulated Google Account:

- **Email**: `demo.user@kiit.ac.in`
- **Name**: `Demo Google User`
- **Roll Number**: `2405099`
- **Course**: `B.Tech CSE`
- **Department**: `Computer Science & Engineering`
- **Year**: `2024 Batch`

### Sample Data:

- **Study Hours**: 42 hours
- **Streak**: 7 days
- **Rank**: #25
- **Verified Status**: ✅ Verified (Google users are auto-verified)

### What You Can Test:

- Dashboard with study statistics
- Study groups and communities
- Chat system
- Goal tracking
- All navigation and UI components

## Switching to Production Mode

To enable real Firebase functionality:

1. Create a Firebase project
2. Copy your Firebase config values
3. Create a `.env` file in the project root
4. Add your Firebase environment variables (see `.env.example`)
5. Restart the development server

The app will automatically detect real Firebase credentials and switch to production mode.
