# Consistify Frontend - Project Structure

## 📁 Organized Project Architecture

```
consistify-frontend/
├── public/                     # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── auth/             # Authentication components
│   │   │   ├── ForgotPasswordForm.js
│   │   │   ├── LoginForm.js
│   │   │   ├── LoginPage.js
│   │   │   └── SignupForm.js
│   │   ├── checkpoints/      # Problem logging components (NEW)
│   │   │   └── (To be created for Checkpoints feature)
│   │   ├── consistency-paths/ # Goal setting components
│   │   │   ├── CheckpointCreateForm.jsx
│   │   │   ├── DemoData.js
│   │   │   ├── index.js
│   │   │   ├── PathCreateForm.jsx
│   │   │   ├── PathDetailModal.jsx
│   │   │   ├── PathEditForm.jsx
│   │   │   └── PathListItem.jsx
│   │   ├── dashboard/        # Dashboard-specific components
│   │   │   ├── DashboardLayout.js
│   │   │   └── Sidebar.js
│   │   ├── memory-echo/      # Repetition reminders (FUTURE)
│   │   ├── progress/         # Progress tracking components (FUTURE)
│   │   └── shared/           # Shared/common components
│   │       ├── AppLayout.jsx
│   │       ├── AppLayout.css
│   │       ├── ProfileMenu.jsx
│   │       └── ProfileMenu.css
│   ├── pages/                # Page-level components
│   │   ├── AuthPage.js
│   │   ├── ConsistencyPathListPage.js
│   │   └── DashboardPage.js
│   ├── services/             # API service layer
│   │   └── api.js
│   ├── hooks/                # Custom React hooks (NEW)
│   ├── context/              # React Context providers (NEW)
│   ├── constants/            # App constants (NEW)
│   ├── types/                # TypeScript/PropTypes definitions
│   │   └── consistencyPath.js
│   ├── utils/                # Utility functions
│   │   └── helpers.js
│   ├── styles/               # Global styles
│   │   └── ConsistencyPaths.css
│   ├── App.js               # Main app component
│   ├── App.css             # App styles
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json
└── PROJECT_STRUCTURE.md    # This file
```

## 🏗️ Architecture Principles

### **Feature-Based Organization**
- Each major feature has its own component folder
- Related components are grouped together
- Easy to locate and maintain feature-specific code

### **Separation of Concerns**
- **Components**: UI logic and presentation
- **Pages**: Route-level components
- **Services**: API calls and data fetching
- **Utils**: Pure functions and helpers
- **Types**: Data structure definitions
- **Hooks**: Reusable state logic
- **Context**: Global state management

### **Naming Conventions**
- **Folders**: kebab-case (`consistency-paths`, `memory-echo`)
- **Components**: PascalCase (`PathCreateForm.jsx`)
- **Files**: camelCase for utilities (`helpers.js`)
- **Constants**: UPPER_SNAKE_CASE

## 🧹 Cleanup Completed

### **Removed Duplicate/Unused Files:**
- ❌ `src/pages/Login.jsx` (empty duplicate)
- ❌ `src/pages/Login.css` (unused)
- ❌ `src/components/Layout.jsx` (duplicate)
- ❌ `src/components/Layout.css` (duplicate)
- ❌ `src/components/dashboard/ConsistencyPathEditForm.js` (duplicate)
- ❌ `src/styles/LoginPage.css` (unused)

### **Reorganized Components:**
- ✅ Moved `AppLayout` to `shared/` folder
- ✅ Moved `ProfileMenu` to `shared/` folder
- ✅ Moved `LoginPage` to `auth/` folder
- ✅ Created feature-specific folders for future development

## 🚀 Ready for Feature Development

The project is now properly organized and ready for the next phase:

### **Phase 2: Checkpoints (Problem Logging)**
Components will be created in `src/components/checkpoints/`:
- CheckpointCreateForm.jsx
- CheckpointListItem.jsx
- CheckpointDetailModal.jsx
- CodeEditor.jsx
- TagSelector.jsx

### **Benefits of New Structure:**
1. **Clear Separation**: Each feature has its dedicated space
2. **Scalability**: Easy to add new features without clutter
3. **Maintainability**: Components are logically grouped
4. **Reusability**: Shared components are easily accessible
5. **Team Collaboration**: Clear structure for multiple developers

---
**Status**: ✅ Frontend project structure cleaned and organized
**Next**: Ready to develop Checkpoints (Problem Logging) feature