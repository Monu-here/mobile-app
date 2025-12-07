# SchoolApp Project Structure - Visual Reference

```
📱 mobile-app/
│
├── 📄 App.js                          ← Main app entry (handles navigation flow)
├── 📄 index.js                        ← Entry point
├── 📄 app.json                        ← Expo configuration
├── 📄 package.json                    ← Dependencies & scripts
├── 📄 FOLDER_STRUCTURE.md             ← This documentation
│
├── 📁 src/                            ← All source code
│   │
│   ├── 📁 screens/                    ← Full-page components
│   │   ├── 📄 OnboardingScreen.js     ← 4-slide onboarding flow
│   │   ├── 📄 LoginScreen.js          ← Email/password login form
│   │   ├── 📄 HomeScreen.js           ← Dashboard after login
│   │   ├── 📄 SignUpScreen.js         ← [Coming soon]
│   │   ├── 📄 ProfileScreen.js        ← [Coming soon]
│   │   └── 📄 ClassesScreen.js        ← [Coming soon]
│   │
│   ├── 📁 components/                 ← Reusable UI components
│   │   ├── 📄 Button.js               ← [Coming soon]
│   │   ├── 📄 Header.js               ← [Coming soon]
│   │   ├── 📄 Input.js                ← [Coming soon]
│   │   ├── 📄 Card.js                 ← [Coming soon]
│   │   └── 📄 Modal.js                ← [Coming soon]
│   │
│   ├── 📁 api/                        ← Backend integration
│   │   ├── 📄 config.js               ← API endpoints & constants
│   │   ├── 📄 apiService.js           ← HTTP client & methods
│   │   ├── 📄 authApi.js              ← [Coming soon]
│   │   └── 📄 classesApi.js           ← [Coming soon]
│   │
│   ├── 📁 utils/                      ← Helper functions
│   │   ├── 📄 storage.js              ← AsyncStorage wrapper
│   │   ├── 📄 validation.js           ← [Coming soon]
│   │   ├── 📄 helpers.js              ← [Coming soon]
│   │   └── 📄 constants.js            ← [Coming soon]
│   │
│   ├── 📁 context/                    ← Global state (Context API)
│   │   ├── 📄 AuthContext.js          ← [Coming soon]
│   │   ├── 📄 ThemeContext.js         ← [Coming soon]
│   │   └── 📄 AppContext.js           ← [Coming soon]
│   │
│   ├── 📁 styles/                     ← Global styling
│   │   ├── 📄 colors.js               ← [Coming soon]
│   │   ├── 📄 typography.js           ← [Coming soon]
│   │   └── 📄 spacing.js              ← [Coming soon]
│   │
│   └── 📁 assets/                     ← App-specific assets
│       ├── 📁 images/                 ← [Coming soon]
│       ├── 📁 icons/                  ← [Coming soon]
│       └── 📁 animations/             ← [Coming soon]
│
├── 📁 assets/                         ← Root assets (images, fonts)
│
├── 📁 [Deprecated - old files]
│   ├── Onboarding.js                  ← Use src/screens/OnboardingScreen.js
│   ├── Login.js                       ← Use src/screens/LoginScreen.js
│   └── Home.js                        ← Use src/screens/HomeScreen.js
│
└── 📄 .gitignore, .npmrc, etc.
```

## 📊 File Statistics

| Category | Files | Status |
|----------|-------|--------|
| Screens | 3 | ✅ Ready |
| Components | 0 | 📋 Planned |
| API | 2 | ✅ Setup |
| Utils | 1 | ✅ Ready |
| Context | 0 | 📋 Planned |
| Styles | 0 | 📋 Planned |
| **Total** | **6** | **Organized** |

## 🎯 Current Architecture

### App Flow
```
App.js (Main)
    ├── Loading State
    ├── OnboardingScreen
    │   └── (4 slides) → [Saves to AsyncStorage]
    ├── LoginScreen
    │   └── (Email/Password form) → [API integration ready]
    └── HomeScreen
        └── (Dashboard) → [Placeholder ready]
```

### Data Flow
```
Storage (AsyncStorage)
    ├── Auth Token
    ├── User Data
    ├── Onboarding Status
    └── Remember Me

API Service
    ├── Login
    ├── Register
    ├── Logout
    ├── Profile
    └── [Extensible]

Screens & Components
    ├── Request → API Service
    ├── Response → Storage
    └── UI Update
```

## 📋 Setup Checklist

- ✅ Folder structure created
- ✅ Screens organized
- ✅ API service setup
- ✅ AsyncStorage utilities added
- ✅ App.js configured with routing logic
- ✅ All files imported correctly
- ✅ No syntax errors
- ⏳ Ready for API integration

## 🚀 Next Steps

### Immediate (This session)
1. ✅ Organize folder structure
2. ⏳ Test in simulator (LAN mode)
3. ⏳ Provide API endpoints

### Short-term
1. Create reusable components
2. Add form validation utilities
3. Implement AuthContext for global state
4. Create SignUp screen

### Medium-term
1. Add more screens (Profile, Classes, etc.)
2. Implement navigation (React Navigation)
3. Add theme/color system
4. Add tests

## 🔗 Import Examples

### ✅ Correct
```javascript
// Screens
import OnboardingScreen from './src/screens/OnboardingScreen';

// API
import apiService from './src/api/apiService';
import { ENDPOINTS } from './src/api/config';

// Utils
import { storeToken, getToken } from './src/utils/storage';
```

### ❌ Avoid
```javascript
// Don't use old root-level files
import Onboarding from './Onboarding';  // ❌ Old location
```

---

**Status**: ✅ **Complete and Ready**

All files are properly organized, imported, and error-free.
Next: Provide API endpoints for login integration!
