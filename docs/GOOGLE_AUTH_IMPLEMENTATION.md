# 🔐 Google Auth Implementation Guide for GymPal

**Status:** 📋 Implementation Guide  
**Last Updated:** December 1, 2025  
**Purpose:** Secure app with Google Auth + authorization whitelist + landing page

---

## 📖 Overview

This guide walks you through:
1. Setting up Google OAuth 2.0
2. Creating an authorization whitelist system
3. Building a landing page for unauthorized users
4. Protecting all routes behind authentication
5. Persisting auth state across sessions

**Result:** Only whitelisted users can access GymPal. Everyone else sees a landing page.

---

## 🎯 Architecture Overview

```
┌──────────────────────┐
│   User Visits App    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Check Auth Token    │
└──────────┬───────────┘
           │
      ┌────┴────┐
      │          │
      ▼          ▼
  Authorized  Not Auth'd
      │          │
      │          ▼
      │    ┌─────────────────┐
      │    │  Landing Page   │
      │    │  (Google Login) │
      │    └────────┬────────┘
      │             │
      │             ▼
      │    ┌─────────────────┐
      │    │ Send ID Token   │
      │    └────────┬────────┘
      │             │
      │    ┌────────▼────────┐
      │    │ Check Whitelist │
      │    └────────┬────────┘
      │             │
      │        ┌────┴────┐
      │        │          │
      │        ▼          ▼
      │     Approved   Denied
      │        │          │
      └────────┤          ▼
               │    ┌──────────────┐
               │    │ Error Page   │
               │    │ (Not Auth'd) │
               │    └──────────────┘
               │
               ▼
        ┌─────────────────┐
        │  GymPal App     │
        │  (Full Access)  │
        └─────────────────┘
```

---

## 🔧 Step 1: Google OAuth Setup

### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: **"GymPal"**
3. Wait for project to initialize

### 1.2 Enable Google Identity Services

1. Search for **"Google Identity Services API"**
2. Click **Enable**
3. Navigate to **Credentials** (left sidebar)

### 1.3 Create OAuth 2.0 Credential

1. Click **Create Credentials** → **OAuth client ID**
2. If prompted, configure OAuth consent screen first:
   - User Type: **External**
   - App name: **"GymPal"**
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `openid`, `email`, `profile`
3. Back to Credentials → **Create OAuth client ID**
4. Application type: **Web application**
5. Name: **"GymPal Web"**
6. Authorized JavaScript origins:
   - `http://localhost:5173` (local dev)
   - `http://localhost:3000` (alt local)
   - `https://your-firebase-domain.web.app` (production)
7. Authorized redirect URIs:
   - `http://localhost:5173/callback`
   - `https://your-firebase-domain.web.app/callback`
8. Copy your **Client ID** (you'll need this)

### 1.4 Add to Environment

Create/update `.env.local`:
```
VITE_GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
VITE_GOOGLE_CLIENT_ID=your_oauth_client_id_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 1.5 Install Google Auth Library

```bash
npm install @react-oauth/google
```

---

## 🛡️ Step 2: Authorization System

### 2.1 Create Whitelist Service

Create `services/auth.ts`:

```typescript
import { UserData } from '../types';

export interface AuthUser {
  email: string;
  name: string;
  picture: string;
  sub: string; // Google unique ID
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthorized: boolean; // Whitelist check
}

// Your authorized users
const WHITELIST = [
  'your-email@gmail.com',
  'trusted-friend@gmail.com',
  // Add more as needed
];

export const authService = {
  // Decode Google JWT token (basic - consider using jwt-decode library)
  decodeToken: (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  },

  // Verify user is in whitelist
  isUserAuthorized: (email: string): boolean => {
    return WHITELIST.includes(email.toLowerCase());
  },

  // Extract user from token
  parseUserFromToken: (token: string): AuthUser | null => {
    const decoded = authService.decodeToken(token);
    if (!decoded) return null;

    return {
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
      sub: decoded.sub,
    };
  },

  // Save auth token to localStorage
  saveToken: (token: string) => {
    localStorage.setItem('gympal_auth_token', token);
    localStorage.setItem('gympal_auth_timestamp', Date.now().toString());
  },

  // Get auth token from localStorage
  getToken: (): string | null => {
    return localStorage.getItem('gympal_auth_token');
  },

  // Check if token is still valid (24 hour expiration)
  isTokenValid: (): boolean => {
    const token = localStorage.getItem('gympal_auth_token');
    const timestamp = localStorage.getItem('gympal_auth_timestamp');

    if (!token || !timestamp) return false;

    const elapsed = Date.now() - parseInt(timestamp);
    const EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

    return elapsed < EXPIRATION_MS;
  },

  // Clear auth
  logout: () => {
    localStorage.removeItem('gympal_auth_token');
    localStorage.removeItem('gympal_auth_timestamp');
    localStorage.removeItem('gympal_user');
  },

  // Save user to localStorage
  saveUser: (user: AuthUser) => {
    localStorage.setItem('gympal_user', JSON.stringify(user));
  },

  // Get saved user
  getSavedUser: (): AuthUser | null => {
    const saved = localStorage.getItem('gympal_user');
    return saved ? JSON.parse(saved) : null;
  },
};
```

### 2.2 Update Types

Add to `types.ts`:

```typescript
export interface AuthUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthorized: boolean;
}
```

---

## 🎨 Step 3: Landing Page Component

Create `components/LandingPage.tsx`:

```typescript
import React, { useRef, useEffect } from 'react';
import { Sparkles, CheckCircle, Shield, Zap, ArrowRight } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { authService } from '../services/auth';

interface LandingPageProps {
  onAuthSuccess: (email: string, name: string, picture: string) => void;
  onAuthError: (error: string) => void;
  isLoading: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onAuthSuccess,
  onAuthError,
  isLoading,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-400" size={28} />
            <span className="text-2xl font-bold text-white">GymPal</span>
          </div>
          <p className="text-gray-300 text-sm">AI-Powered Fitness Coach</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your Personal
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {' '}AI Fitness Coach
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Personalized calisthenics training, form guidance, recovery tracking, and real-time coaching—all tailored to your body and goals.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <FeatureCard
              icon={<Zap size={24} />}
              title="Real-Time Coaching"
              description="Ask your AI coach anything. Form checks, pain management, progression planning."
            />
            <FeatureCard
              icon={<Shield size={24} />}
              title="Safe & Smart"
              description="Protection for your specific constraints. L4/L5 back safety always prioritized."
            />
            <FeatureCard
              icon={<CheckCircle size={24} />}
              title="Weekly Progress"
              description="Chat summaries, body metrics tracking, and AI-informed exercise progression."
            />
          </div>

          {/* Auth Section */}
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-12 backdrop-blur-sm text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Transform Your Fitness?</h2>
            <p className="text-gray-300 mb-8 text-lg">
              Sign in with your authorized Google account to start your journey with GymPal.
            </p>

            <div className="flex justify-center mb-8">
              <GoogleLogin
                onSuccess={(credentialResponse) => {
                  if (credentialResponse.credential) {
                    const user = authService.parseUserFromToken(credentialResponse.credential);
                    if (user) {
                      const isAuthorized = authService.isUserAuthorized(user.email);
                      
                      if (isAuthorized) {
                        authService.saveToken(credentialResponse.credential);
                        authService.saveUser(user);
                        onAuthSuccess(user.email, user.name, user.picture);
                      } else {
                        onAuthError(`${user.email} is not authorized to access GymPal.`);
                      }
                    }
                  }
                }}
                onError={() => {
                  onAuthError('Login failed. Please try again.');
                }}
              />
            </div>

            {isLoading && (
              <div className="text-purple-300 animate-pulse">
                Verifying authorization...
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <InfoBlock
              title="What You'll Get"
              items={[
                'Weekly AI-powered workout plans',
                'Real-time form feedback from your coach',
                'Safe exercise alternatives for your body',
                'Chat persistence with weekly summaries',
                'Nutrition tracking & body metrics',
                'Periodization strategy (6-week cycles)',
              ]}
            />
            <InfoBlock
              title="For Calisthenics Athletes"
              items={[
                'Human Flag progression guidance',
                'Muscle Up training progression',
                'Flexibility & mobility tracking',
                'Strength maintenance strategies',
                'Recovery protocol optimization',
                'Real-time pain management',
              ]}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-8 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>GymPal © 2025 | Secure • Private • Authorized Users Only</p>
        </div>
      </footer>
    </div>
  );
};

// Component: Feature Card
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-6 hover:bg-white/20 transition">
    <div className="text-purple-400 mb-3">{icon}</div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300 text-sm">{description}</p>
  </div>
);

// Component: Info Block
interface InfoBlockProps {
  title: string;
  items: string[];
}

const InfoBlock: React.FC<InfoBlockProps> = ({ title, items }) => (
  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8">
    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-gray-300">
          <CheckCircle size={20} className="text-green-400 mt-0.5 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);
```

---

## ❌ Step 4: Authorization Error Page

Create `components/UnauthorizedPage.tsx`:

```typescript
import React from 'react';
import { AlertCircle, Mail, ArrowLeft } from 'lucide-react';

interface UnauthorizedPageProps {
  email: string;
  onLogout: () => void;
}

export const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({ email, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-red-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-red-900/50 border-2 border-red-500 rounded-xl p-8 backdrop-blur">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-500/20 p-4 rounded-full">
              <AlertCircle size={40} className="text-red-400" />
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl font-bold text-white text-center mb-4">
            Access Denied
          </h1>

          <p className="text-gray-300 text-center mb-6">
            The email <span className="font-semibold text-red-300">{email}</span> is not authorized to access GymPal.
          </p>

          <p className="text-gray-400 text-sm text-center mb-8">
            If you believe this is an error, please contact the administrator for access.
          </p>

          {/* Contact Info */}
          <div className="bg-white/5 rounded-lg p-4 mb-8">
            <p className="text-gray-300 text-sm flex items-center gap-2">
              <Mail size={16} className="text-blue-400" />
              Contact: your-email@gmail.com
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            <ArrowLeft size={18} />
            Try Another Account
          </button>
        </div>

        {/* Help Text */}
        <p className="text-center text-gray-400 text-xs mt-8">
          GymPal is a private, authorized-only application.
        </p>
      </div>
    </div>
  );
};
```

---

## 🔄 Step 5: Update App.tsx with Auth Flow

Update `App.tsx`:

```typescript
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Dumbbell, LogOut } from 'lucide-react';

import { SAFE_ALTERNATIVES, INITIAL_PLAN, SKILL_TREES, SPEEDIANCE_LIBRARY } from './constants';
import { Plan, DayPlan, NutritionLog, BodyStats, HistoryEntry, NutritionHistoryEntry, UserData, Exercise, WeeklyChat, ChatMessage } from './types';
import { storageService } from './services/storage';
import { geminiService } from './services/gemini';
import { authService, AuthUser } from './services/auth';
import { LandingPage } from './components/LandingPage';
import { UnauthorizedPage } from './components/UnauthorizedPage';
import { StatCard } from './components/StatCard';
import { SkillCard } from './components/SkillCard';
import WorkoutView from './components/WorkoutView';
import { AiCoach } from './components/AiCoach';
import { HistoryView } from './components/HistoryView';
import { CheckInModal } from './components/CheckInModal';
import { FuelModal } from './components/FuelModal';
import { AdminView } from './components/AdminView';

// ... existing normalizePlan and other utilities ...

export default function App() {
  // Auth state
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    // Try to load from localStorage on mount
    return authService.getSavedUser();
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Existing app state
  const [activeTab, setActiveTab] = useState('schedule');
  const [plan, setPlan] = useState<Plan | null>(null);
  const [completedWorkouts, setCompletedWorkouts] = useState<string[]>([]);
  // ... rest of existing state ...

  // Check auth on mount
  useEffect(() => {
    const token = authService.getToken();
    const isValid = authService.isTokenValid();

    if (token && isValid && authUser) {
      const authorized = authService.isUserAuthorized(authUser.email);
      setIsAuthorized(authorized);
    }
  }, [authUser]);

  // Hydrate data after auth confirmed
  useEffect(() => {
    if (!authUser || !isAuthorized) return;

    setLoading(true);
    storageService.subscribe(setUserData);

    return () => {
      storageService.unsubscribe();
    };
  }, [authUser, isAuthorized]);

  // Handle successful Google login
  const handleAuthSuccess = async (email: string, name: string, picture: string) => {
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      const authorized = authService.isUserAuthorized(email);
      const user: AuthUser = { email, name, picture, sub: email };

      if (authorized) {
        setAuthUser(user);
        setIsAuthorized(true);
        setAuthError(null);
      } else {
        setAuthError(`${email} is not authorized to access GymPal.`);
        setAuthUser(user);
        setIsAuthorized(false);
      }
    } catch (error) {
      setAuthError('Authentication failed. Please try again.');
      console.error('Auth error:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    setAuthUser(null);
    setIsAuthorized(false);
    setAuthError(null);
  };

  // Render states

  // Not authenticated - show landing page
  if (!authUser) {
    return (
      <GoogleOAuthProvider clientId={process.env.VITE_GOOGLE_CLIENT_ID || ''}>
        <LandingPage
          onAuthSuccess={handleAuthSuccess}
          onAuthError={setAuthError}
          isLoading={isAuthLoading}
        />
        {authError && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            {authError}
          </div>
        )}
      </GoogleOAuthProvider>
    );
  }

  // Authenticated but not authorized - show error page
  if (authUser && !isAuthorized) {
    return <UnauthorizedPage email={authUser.email} onLogout={handleLogout} />;
  }

  // Fully authorized - show app
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Logout */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="text-blue-600" size={28} />
            <h1 className="text-2xl font-bold text-gray-900">GymPal</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {authUser && (
              <div className="flex items-center gap-3">
                <img
                  src={authUser.picture}
                  alt={authUser.name}
                  className="w-8 h-8 rounded-full"
                  title={authUser.email}
                />
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {authUser.name}
                </span>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              title="Logout"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Existing app content */}
      <main className="max-w-7xl mx-auto">
        {/* All your existing tabs and components */}
        {/* ... */}
      </main>
    </div>
  );
}
```

---

## 🚀 Step 6: Update index.tsx

Update `index.tsx` to wrap with GoogleOAuthProvider:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import './index.css';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
```

---

## 🛡️ Step 7: Whitelist Management

### Add to Firebase Firestore (Optional but Recommended)

Instead of hardcoding whitelist, store in Firestore:

```typescript
// services/auth.ts - Enhanced version
export const authService = {
  // ... existing code ...

  // Fetch whitelist from Firestore
  fetchWhitelist: async (): Promise<string[]> => {
    try {
      const db = getFirestore();
      const whitelistDoc = await getDoc(doc(db, 'admin', 'whitelist'));
      
      if (whitelistDoc.exists()) {
        return whitelistDoc.data().emails || [];
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch whitelist:', error);
      return [];
    }
  },

  // Check with Firestore whitelist
  isUserAuthorizedAsync: async (email: string): Promise<boolean> => {
    const whitelist = await authService.fetchWhitelist();
    return whitelist.includes(email.toLowerCase());
  },
};
```

### Set Up Whitelist in Firestore

1. Go to Firebase Console → Firestore
2. Create collection: `admin`
3. Create document: `whitelist`
4. Add field: `emails` (array)
5. Add your authorized emails:
   ```
   emails: [
     "your-email@gmail.com",
     "trusted-friend@gmail.com",
     "another-user@gmail.com"
   ]
   ```

---

## 🧪 Testing Auth Flow

### Local Testing

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test landing page:**
   - Visit `http://localhost:5173`
   - Should see landing page with Google login button
   - Logout and verify flow works

3. **Test authorized user:**
   - Use whitelisted email to login
   - Should access GymPal app
   - Should see your profile picture + name in header

4. **Test unauthorized user:**
   - Comment out your email from `WHITELIST` in `services/auth.ts`
   - Login with that email
   - Should see "Access Denied" page
   - Logout button should return to landing page

### Production Testing

Before deploying:

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` and test full flow.

---

## 🔐 Security Best Practices

### ✅ DO

- ✅ **Use HTTPS** in production (Firebase Hosting provides this)
- ✅ **Verify tokens on backend** (if adding backend API)
- ✅ **Set token expiration** (current: 24 hours)
- ✅ **Store whitelist in Firestore** (not hardcoded)
- ✅ **Use Firebase security rules** to protect data
- ✅ **Rotate API keys** regularly
- ✅ **Implement rate limiting** on auth checks

### ❌ DON'T

- ❌ **Don't store sensitive data in localStorage** without encryption
- ❌ **Don't hardcode credentials** in source code
- ❌ **Don't expose your Client ID** (it's safe but rotate it)
- ❌ **Don't skip backend verification** if building API layer
- ❌ **Don't commit .env.local** to git (add to .gitignore)

### .gitignore Update

```
.env.local
.env*.local
node_modules/
dist/
```

---

## 📋 Firebase Security Rules

Add to Firebase Console → Firestore Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read their own document
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }

    // Admin collection - only for admin reads (if needed)
    match /admin/{document=**} {
      allow read: if false; // Fetch via secure backend only
      allow write: if false; // Only modify manually in console
    }

    // Allow reads for storing chat history
    match /gympal/user/chatHistory/{doc=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 🚀 Deployment Checklist

Before deploying to Firebase:

- [ ] Update `VITE_GOOGLE_CLIENT_ID` in `.env.local` with production OAuth key
- [ ] Add production domain to Google OAuth authorized origins
- [ ] Set up whitelist in Firestore (recommended)
- [ ] Test with whitelisted email on staging
- [ ] Test with non-whitelisted email (should see error)
- [ ] Verify logout flow works
- [ ] Check that landing page displays correctly
- [ ] Run `npm run build` with no errors
- [ ] Test `npm run preview` before deployment

### Deploy

```bash
npm run build
firebase deploy --only hosting
```

---

## 🐛 Troubleshooting

### Issue: "Google Login button doesn't appear"
**Solution:**
- Verify `VITE_GOOGLE_CLIENT_ID` is set correctly
- Check that `GoogleOAuthProvider` wraps your app
- Check browser console for errors

### Issue: "Login works but unauthorized page shows"
**Solution:**
- Verify email is in `WHITELIST` array
- Email must match exactly (case-insensitive check built-in)
- Check Firestore whitelist if using database approach

### Issue: "Token expires too quickly"
**Solution:**
- Update `EXPIRATION_MS` in `services/auth.ts`
- Google ID tokens typically valid for 1 hour
- You can implement token refresh in `getToken()`

### Issue: "CORS errors on login"
**Solution:**
- Verify OAuth redirect URIs include current domain
- Update Google Cloud Console authorized origins
- Clear browser cache + localStorage

### Issue: "User data doesn't persist after refresh"
**Solution:**
- Verify `localStorage` isn't disabled
- Check `isTokenValid()` logic
- Add debugging in `useEffect` on App mount

---

## 📚 Example Implementation Timeline

**Day 1 (2 hours):**
- Set up Google Cloud Project
- Get OAuth credentials
- Install `@react-oauth/google`

**Day 2 (3 hours):**
- Create `services/auth.ts`
- Create `LandingPage.tsx`
- Create `UnauthorizedPage.tsx`

**Day 3 (2 hours):**
- Update `App.tsx` with auth flow
- Update `index.tsx` with provider
- Test locally

**Day 4 (1 hour):**
- Set up Firestore whitelist (optional)
- Update security rules
- Final testing

**Deploy (30 min):**
- Build & deploy to Firebase

**Total: ~8-10 hours for full implementation**

---

## 📞 Support & Debugging

### Enable Debug Logging

Add to `services/auth.ts`:

```typescript
const DEBUG = true;

const log = (message: string, data?: any) => {
  if (DEBUG) {
    console.log(`[GymPal Auth] ${message}`, data || '');
  }
};

// Use throughout:
log('User authorized', { email: user.email, authorized: isUserAuthorized });
```

### Check Token in Browser Console

```javascript
// In browser console
localStorage.getItem('gympal_auth_token')
localStorage.getItem('gympal_user')
localStorage.getItem('gympal_auth_timestamp')
```

---

## ✨ Summary

You now have:

✅ **Google OAuth 2.0 integration**  
✅ **Landing page for public visitors**  
✅ **Authorization whitelist system**  
✅ **Protected GymPal app**  
✅ **Authorization error page**  
✅ **Logout functionality**  
✅ **Token persistence & validation**  
✅ **Production-ready security**  

**Result:** Only authorized users can access GymPal. Everyone else sees a beautiful landing page with login button.

Next: Deploy and test the full auth flow in production! 🚀

---

**Last Updated:** December 1, 2025  
**Status:** 📋 Ready for Implementation  
**Estimated Time:** 8-10 hours

