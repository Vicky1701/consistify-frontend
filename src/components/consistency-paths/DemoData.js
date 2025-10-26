/**
 * Demo data for testing the consistency paths functionality
 */

export const demoConsistencyPaths = [
  {
    id: 1,
    name: "7-Day Kickstart",
    durationDays: 7,
    dailyTarget: 2,
    repetitionCycle: 2,
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
  },
  {
    id: 2,
    name: "DSA Reboot",
    durationDays: 30,
    dailyTarget: 3,
    repetitionCycle: 3,
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-25T14:20:00Z",
  },
  {
    id: 3,
    name: "Array Master",
    durationDays: 14,
    dailyTarget: 2,
    repetitionCycle: 2,
    createdAt: "2024-01-18T16:45:00Z",
    updatedAt: "2024-01-22T11:10:00Z",
  },
  {
    id: 4,
    name: "Graph Explorer",
    durationDays: 21,
    dailyTarget: 1,
    repetitionCycle: 3,
    createdAt: "2024-01-12T07:30:00Z",
    updatedAt: "2024-01-24T13:45:00Z",
  },
  {
    id: 5,
    name: "DP Destroyer",
    durationDays: 45,
    dailyTarget: 2,
    repetitionCycle: 4,
    createdAt: "2024-01-08T12:00:00Z",
    updatedAt: "2024-01-26T15:20:00Z",
  },
];

export const demoCheckpoints = [
  {
    id: 1,
    title: "Two Sum",
    source: "LeetCode",
    tags: ["Arrays", "Hash Tables"],
    notes: "Classic problem - remember to use hash map for O(n) solution",
    code: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
    pathId: 1,
  },
  {
    id: 2,
    title: "Binary Tree Inorder Traversal",
    source: "LeetCode",
    tags: ["Trees", "Recursion"],
    notes:
      "Three approaches: recursive, iterative with stack, Morris traversal",
    code: `class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        inorder(root, result);
        return result;
    }
    
    private void inorder(TreeNode node, List<Integer> result) {
        if (node != null) {
            inorder(node.left, result);
            result.add(node.val);
            inorder(node.right, result);
        }
    }
}`,
    pathId: 1,
  },
  {
    id: 3,
    title: "Maximum Subarray",
    source: "LeetCode",
    tags: ["Arrays", "Dynamic Programming"],
    notes: "Kadane's algorithm - track current and maximum sum",
    code: `class Solution {
    public int maxSubArray(int[] nums) {
        int maxSum = nums[0];
        int currentSum = nums[0];
        
        for (int i = 1; i < nums.length; i++) {
            currentSum = Math.max(nums[i], currentSum + nums[i]);
            maxSum = Math.max(maxSum, currentSum);
        }
        
        return maxSum;
    }
}`,
    pathId: 2,
  },
];

// Mock API responses for demo purposes
export const createMockApiResponse = (data, delay = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data });
    }, delay);
  });
};

export const createMockApiError = (message = "API Error", delay = 500) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message));
    }, delay);
  });
};
