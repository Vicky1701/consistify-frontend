# Checkpoints (Problem Logging) - Architecture Design

## 🎯 **Feature Overview**
A comprehensive problem logging system that allows users to:
- Manually enter DSA problems with rich metadata
- Save multiple code solutions with different approaches
- Organize problems with tags and difficulty levels
- Link problems to consistency paths
- Track solving progress and notes

## 🏗️ **Data Architecture**

### **Primary Entity: Checkpoint**
```javascript
{
  id: "cp_001",
  title: "Two Sum",
  source: {
    platform: "LeetCode",
    url: "https://leetcode.com/problems/two-sum/",
    problemNumber: "1"
  },
  difficulty: "Easy",
  tags: ["Array", "Hash Table", "Two Pointers"],
  codes: [
    {
      id: "code_001",
      title: "Brute Force Approach",
      language: "Java",
      code: "public int[] twoSum(int[] nums, int target) {...}",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      approach: "Nested loops to check all pairs",
      createdAt: "2025-10-26T10:00:00Z"
    },
    {
      id: "code_002", 
      title: "Optimized Hash Map",
      language: "Java",
      code: "public int[] twoSum(int[] nums, int target) {...}",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      approach: "Single pass with HashMap for complement lookup",
      createdAt: "2025-10-26T11:00:00Z"
    }
  ],
  notes: "Important: Remember to handle edge cases like duplicate values",
  status: "Solved",
  consistencyPathId: "path_001",
  createdAt: "2025-10-26T09:00:00Z",
  lastModified: "2025-10-26T11:00:00Z"
}
```

## 📁 **Component Architecture**

### **1. Core Components**
```
src/components/checkpoints/
├── CheckpointCreateForm.jsx      # Main form to create checkpoints
├── CheckpointListView.jsx        # Display list of all checkpoints
├── CheckpointListItem.jsx        # Individual checkpoint card
├── CheckpointDetailModal.jsx     # Detailed view/edit checkpoint
├── CodeEditor/                   # Code editing components
│   ├── CodeEditorModal.jsx      # Multi-code editor interface
│   ├── CodeSnippet.jsx          # Display saved code
│   └── LanguageSelector.jsx     # Programming language selection
├── Filters/                      # Filtering components
│   ├── TagFilter.jsx            # Filter by tags
│   ├── DifficultyFilter.jsx     # Filter by difficulty
│   └── SourceFilter.jsx         # Filter by source platform
└── Shared/                       # Reusable components
    ├── TagSelector.jsx          # Multi-select tags
    ├── SourceSelector.jsx       # Platform + URL input
    └── StatusBadge.jsx          # Status indicator
```

### **2. Pages**
```
src/pages/
├── CheckpointsListPage.jsx       # Main checkpoints page
└── CheckpointDetailPage.jsx     # Individual checkpoint page
```

### **3. Services & Utils**
```
src/services/
└── checkpointsApi.js            # API calls for checkpoints

src/types/
└── checkpoint.js                # TypeScript/PropTypes definitions

src/utils/
├── codeTemplates.js             # Code templates for languages
└── checkpointHelpers.js         # Utility functions
```

## 🎨 **UI/UX Design Patterns**

### **1. Main Checkpoints Page Layout**
```
┌─────────────────────────────────────────────────────────────┐
│ Checkpoints Dashboard                            [+ Add New] │
├─────────────────────────────────────────────────────────────┤
│ 🔍 Search  | 🏷️ Tags: All ▼ | ⚡ Difficulty: All ▼ | 🌐 Source: All ▼ │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│ │ Two Sum     │ │ Valid Par.  │ │ Merge Sort  │             │
│ │ 💚 Easy     │ │ 🟡 Medium   │ │ 🔴 Hard     │             │
│ │ Array, Hash │ │ Stack       │ │ Divide&Conq │             │
│ │ 2 solutions │ │ 1 solution  │ │ 3 solutions │             │
│ │ LeetCode    │ │ Custom      │ │ GeeksforG   │             │
│ └─────────────┘ └─────────────┘ └─────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

### **2. Checkpoint Creation Form**
```
┌─────────────────────────────────────────────────────────────┐
│ Create New Checkpoint                                   [X] │
├─────────────────────────────────────────────────────────────┤
│ Problem Title: [Two Sum Problem                          ] │
│                                                             │
│ Source:                                                     │
│ Platform: [LeetCode ▼]  URL: [https://leetcode.com/...   ] │
│                                                             │
│ Difficulty: ( ) Easy  (•) Medium  ( ) Hard                 │
│                                                             │
│ Tags: [Array] [Hash Table] [+ Add Tag]                     │
│                                                             │
│ Status: ( ) Attempted  (•) Solved  ( ) Review              │
│                                                             │
│ Notes: [Important edge cases to remember...              ] │
│        [                                                 ] │
│                                                             │
│ Codes: [+ Add Code Solution]                               │
│                                                             │
│                                    [Cancel] [Save Checkpoint] │
└─────────────────────────────────────────────────────────────┘
```

### **3. Multi-Code Editor Interface**
```
┌─────────────────────────────────────────────────────────────┐
│ Code Solutions for "Two Sum"                           [X] │
├─────────────────────────────────────────────────────────────┤
│ Tabs: [Brute Force] [Optimized HashMap] [+ Add Solution]   │
├─────────────────────────────────────────────────────────────┤
│ Solution Title: [Brute Force Approach              ]       │
│ Language: [Java ▼]  Time: [O(n²)]  Space: [O(1)]         │
│                                                             │
│ Approach Description:                                       │
│ [Use nested loops to check all possible pairs...        ]  │
│                                                             │
│ Code:                                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ public int[] twoSum(int[] nums, int target) {          │ │
│ │     for (int i = 0; i < nums.length; i++) {           │ │
│ │         for (int j = i + 1; j < nums.length; j++) {   │ │
│ │             if (nums[i] + nums[j] == target) {         │ │
│ │                 return new int[]{i, j};                │ │
│ │             }                                          │ │
│ │         }                                              │ │
│ │     }                                                  │ │
│ │     return new int[]{};                               │ │
│ │ }                                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                    [Delete] [Save Solution] │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 **User Flow**

### **Primary Workflows:**

1. **Add New Checkpoint:**
   ```
   Dashboard → [+ Add New] → Fill Form → Add Code(s) → Save
   ```

2. **View/Edit Checkpoint:**
   ```
   Dashboard → Click Card → Detail Modal → Edit → Save
   ```

3. **Add Multiple Solutions:**
   ```
   Checkpoint Detail → [+ Add Code] → Enter Solution → Save → Repeat
   ```

4. **Filter/Search:**
   ```
   Dashboard → Use Filters → Apply → View Results
   ```

## 🎯 **Key Features Implementation**

### **1. Multi-Code Support**
- Each checkpoint can have multiple code solutions
- Each solution has its own title, approach, complexity analysis
- Easy switching between solutions with tabs
- Support for multiple programming languages

### **2. Rich Metadata**
- Source platform integration (LeetCode, GeeksforGeeks, Custom)
- Comprehensive tagging system
- Difficulty levels with color coding
- Progress status tracking

### **3. Advanced Search & Filtering**
- Real-time search across problem titles
- Filter by tags, difficulty, source, status
- Sort by date, difficulty, or custom order

### **4. Integration with Consistency Paths**
- Link checkpoints to specific consistency paths
- Track progress within each path
- Count towards daily targets

## 🚀 **Implementation Priority**

### **Phase 1 (Core):**
1. Basic checkpoint creation form
2. Simple code editor with syntax highlighting
3. Checkpoint list view with basic filtering
4. CRUD operations

### **Phase 2 (Enhanced):**
1. Multi-code solution support
2. Advanced filtering and search
3. Rich text editor for notes
4. Export/import functionality

### **Phase 3 (Advanced):**
1. Code execution/testing
2. AI-powered hints and suggestions
3. Collaboration features
4. Analytics and insights

## 🎨 **Design System**

### **Color Scheme:**
- **Easy**: #4CAF50 (Green)
- **Medium**: #FF9800 (Orange) 
- **Hard**: #F44336 (Red)
- **Primary**: #2196F3 (Blue)
- **Success**: #4CAF50 (Green)

### **Icons:**
- Code: `<Code />`
- Tags: `<LocalOffer />`
- Difficulty: `<TrendingUp />`
- Source: `<Link />`
- Notes: `<Notes />`

---

**This architecture provides a scalable, user-friendly foundation for the Checkpoints feature while maintaining consistency with your existing codebase.**