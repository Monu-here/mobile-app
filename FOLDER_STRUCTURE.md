# SchoolApp Mobile - Folder Structure

## Project Organization

```
mobile-app/
├── App.js                          # Entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── index.js                        # App initializer
├── assets/                         # Static assets
│   ├── images/
│   └── fonts/
│
├── src/
│   ├── screens/                    # Full screen components
│   │   ├── OnboardingScreen.js     # Onboarding flow
│   │   ├── LoginScreen.js          # Login form
│   │   ├── HomeScreen.js           # Dashboard/Home
│   │   └── [Future screens...]
│   │
│   ├── components/                 # Reusable components
│   │   ├── Header.js
│   │   ├── Button.js
│   │   ├── Input.js
│   │   └── [Other components...]
│   │
│   ├── api/                        # API integration
│   │   ├── config.js               # API endpoints & constants
│   │   ├── apiService.js           # HTTP client & methods
│   │   └── [Feature-specific APIs...]
│   │
│   ├── utils/                      # Utility functions
│   │   ├── storage.js              # AsyncStorage helpers
│   │   ├── validation.js           # Form validation
│   │   ├── helpers.js              # General helpers
│   │   └── constants.js            # App constants
│   │
│   ├── context/                    # Context API / State management
│   │   ├── AuthContext.js          # Authentication context
│   │   ├── ThemeContext.js         # Theme context
│   │   └── [Other contexts...]
│   │
│   ├── styles/                     # Global styles
│   │   ├── colors.js               # Color palette
│   │   ├── typography.js           # Typography styles
│   │   └── spacing.js              # Spacing constants
│   │
│   └── assets/                     # App-specific assets
│       ├── images/
│       ├── icons/
│       └── animations/
│
└── [Backup old files]
    ├── Onboarding.js               (deprecated)
    ├── Login.js                    (deprecated)
    └── Home.js                     (deprecated)
```

## Folder Descriptions

### `/src/screens`
**Purpose**: Full-screen components that represent different views/pages in the app.
- Each screen component is self-contained
- Handles navigation logic for that screen
- Manages local state for that screen
- Examples: Onboarding, Login, Home, Profile, Classes, etc.

### `/src/components`
**Purpose**: Reusable UI components that can be used across multiple screens.
- Small, focused components (Button, Input, Card, etc.)
- Props-driven and composable
- Shared styling and behavior
- Examples: Header, Button, TextInput, Modal, List, etc.

### `/src/api`
**Purpose**: API/Backend integration
- `config.js`: API endpoints, constants, error messages
- `apiService.js`: HTTP client with methods for different endpoints
- Feature-specific files: `authApi.js`, `classesApi.js`, etc.

### `/src/utils`
**Purpose**: Helper functions and utilities
- `storage.js`: AsyncStorage wrapper for persistent data
- `validation.js`: Form validation helpers
- `helpers.js`: Common utility functions
- `constants.js`: App-wide constants

### `/src/context`
**Purpose**: Context API for global state management
- `AuthContext.js`: Authentication state (user, token, etc.)
- `ThemeContext.js`: Theme/appearance settings
- Other global states as needed

### `/src/styles`
**Purpose**: Shared styling definitions
- `colors.js`: Color palette
- `typography.js`: Font sizes, weights, line heights
- `spacing.js`: Margin, padding, gap constants

## How to Add New Features

### Adding a New Screen
1. Create file in `/src/screens/[FeatureName]Screen.js`
2. Import and add to `App.js` navigation logic
3. Create any unique components in `/src/components`

### Adding Reusable Components
1. Create file in `/src/components/[ComponentName].js`
2. Export as default
3. Use in multiple screens

### Adding API Endpoints
1. Add endpoint to `/src/api/config.js`
2. Add method to `/src/api/apiService.js` or create feature-specific API file
3. Import and use in screens/components

### Adding Global State
1. Create context file in `/src/context/[Feature]Context.js`
2. Create provider component
3. Wrap app or sections with provider in `App.js`

## Best Practices

1. **Keep screens clean**: Screens should focus on layout and navigation
2. **Reuse components**: Create small components and reuse them
3. **Separate concerns**: Business logic in API/utils, UI in components
4. **Use constants**: Import from `config.js` instead of hardcoding values
5. **Type safety**: Add propTypes or TypeScript (optional)
6. **Naming conventions**:
   - Screens: `[Feature]Screen.js`
   - Components: `[ComponentName].js`
   - Context: `[Feature]Context.js`
   - Utils: `[featureName].js`

## Current Status

✅ **Implemented**
- Folder structure created
- Onboarding screen moved to `/src/screens/`
- Login screen moved to `/src/screens/`
- Home screen moved to `/src/screens/`
- API service setup (`config.js`, `apiService.js`)
- Storage utilities (`storage.js`)
- AsyncStorage installed

📋 **TODO**
- Create reusable components in `/src/components/`
- Add form validation utilities
- Implement context for auth state
- Create theme/color constants
- Add more utility functions
- Create SignUp screen
- Add navigation package (React Navigation) if needed

## Connecting Your API

When you provide API endpoints:

1. **Update `/src/api/config.js`**:
   - Set `API_BASE_URL` to your backend URL
   - Add your endpoints to `ENDPOINTS` object

2. **Update `/src/api/apiService.js`**:
   - Modify methods to match your API response format
   - Handle your error response format

3. **Update `/src/screens/LoginScreen.js`**:
   - Replace the mock login logic with actual API call using `apiService.login()`

4. **Store tokens**:
   - Use `storage.js` functions to persist tokens

Example:
```javascript
// In LoginScreen.js
import apiService from '../api/apiService';
import { storeToken } from '../utils/storage';

const handleLogin = async () => {
  try {
    const response = await apiService.login(email, password);
    await storeToken(response.token);
    onLoginSuccess(response.user);
  } catch (error) {
    // Handle error
  }
};
```

---

Ready to add your API? Provide the endpoint details and I'll integrate them!
