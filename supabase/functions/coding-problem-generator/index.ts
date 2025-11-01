import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const codingProblems = [
  // Easy Problems (5)
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists'],
    testCases: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' }
    ],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  // Your code here\n}',
      python: 'def twoSum(nums, target):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n  }\n};',
      c: 'int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '2',
    title: 'Palindrome Number',
    difficulty: 'easy',
    description: 'Given an integer x, return true if x is a palindrome, and false otherwise.',
    constraints: ['-2^31 <= x <= 2^31 - 1'],
    testCases: [
      { input: 'x = 121', output: 'true' },
      { input: 'x = -121', output: 'false', explanation: 'Reads -121 from right to left' },
      { input: 'x = 10', output: 'false' }
    ],
    starterCode: {
      javascript: 'function isPalindrome(x) {\n  // Your code here\n}',
      python: 'def isPalindrome(x):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public boolean isPalindrome(int x) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  bool isPalindrome(int x) {\n    // Your code here\n  }\n};',
      c: 'bool isPalindrome(int x) {\n  // Your code here\n}'
    }
  },
  {
    id: '3',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid.',
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only'],
    testCases: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    starterCode: {
      javascript: 'function isValid(s) {\n  // Your code here\n}',
      python: 'def isValid(s):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public boolean isValid(String s) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  bool isValid(string s) {\n    // Your code here\n  }\n};',
      c: 'bool isValid(char* s) {\n  // Your code here\n}'
    }
  },
  {
    id: '4',
    title: 'Merge Two Sorted Lists',
    difficulty: 'easy',
    description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.',
    constraints: ['The number of nodes in both lists is in the range [0, 50]', '-100 <= Node.val <= 100'],
    testCases: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
      { input: 'list1 = [], list2 = []', output: '[]' },
      { input: 'list1 = [], list2 = [0]', output: '[0]' }
    ],
    starterCode: {
      javascript: 'function mergeTwoLists(list1, list2) {\n  // Your code here\n}',
      python: 'def mergeTwoLists(list1, list2):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    // Your code here\n  }\n};',
      c: 'struct ListNode* mergeTwoLists(struct ListNode* list1, struct ListNode* list2) {\n  // Your code here\n}'
    }
  },
  {
    id: '5',
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'easy',
    description: 'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place.',
    constraints: ['1 <= nums.length <= 3 * 10^4', '-100 <= nums[i] <= 100'],
    testCases: [
      { input: 'nums = [1,1,2]', output: '2' },
      { input: 'nums = [0,0,1,1,1,2,2,3,3,4]', output: '5' }
    ],
    starterCode: {
      javascript: 'function removeDuplicates(nums) {\n  // Your code here\n}',
      python: 'def removeDuplicates(nums):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public int removeDuplicates(int[] nums) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  int removeDuplicates(vector<int>& nums) {\n    // Your code here\n  }\n};',
      c: 'int removeDuplicates(int* nums, int numsSize) {\n  // Your code here\n}'
    }
  },
  // Medium Problems (20)
  {
    id: '6',
    title: 'Add Two Numbers',
    difficulty: 'medium',
    description: 'You are given two non-empty linked lists representing two non-negative integers. Add the two numbers and return the sum as a linked list.',
    constraints: ['The number of nodes in each linked list is in the range [1, 100]', '0 <= Node.val <= 9'],
    testCases: [
      { input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]', explanation: '342 + 465 = 807' },
      { input: 'l1 = [0], l2 = [0]', output: '[0]' }
    ],
    starterCode: {
      javascript: 'function addTwoNumbers(l1, l2) {\n  // Your code here\n}',
      python: 'def addTwoNumbers(l1, l2):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n    // Your code here\n  }\n};',
      c: 'struct ListNode* addTwoNumbers(struct ListNode* l1, struct ListNode* l2) {\n  // Your code here\n}'
    }
  },
  {
    id: '7',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces'],
    testCases: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc"' },
      { input: 's = "bbbbb"', output: '1' },
      { input: 's = "pwwkew"', output: '3' }
    ],
    starterCode: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  // Your code here\n}',
      python: 'def lengthOfLongestSubstring(s):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public int lengthOfLongestSubstring(String s) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  int lengthOfLongestSubstring(string s) {\n    // Your code here\n  }\n};',
      c: 'int lengthOfLongestSubstring(char* s) {\n  // Your code here\n}'
    }
  },
  {
    id: '8',
    title: 'Container With Most Water',
    difficulty: 'medium',
    description: 'Find two lines that together with the x-axis form a container with the most water.',
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    testCases: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
      { input: 'height = [1,1]', output: '1' }
    ],
    starterCode: {
      javascript: 'function maxArea(height) {\n  // Your code here\n}',
      python: 'def maxArea(height):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public int maxArea(int[] height) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  int maxArea(vector<int>& height) {\n    // Your code here\n  }\n};',
      c: 'int maxArea(int* height, int heightSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '9',
    title: '3Sum',
    difficulty: 'medium',
    description: 'Given an integer array nums, return all triplets that sum to zero.',
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    testCases: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', output: '[]' }
    ],
    starterCode: {
      javascript: 'function threeSum(nums) {\n  // Your code here\n}',
      python: 'def threeSum(nums):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public List<List<Integer>> threeSum(int[] nums) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  vector<vector<int>> threeSum(vector<int>& nums) {\n    // Your code here\n  }\n};',
      c: 'int** threeSum(int* nums, int numsSize, int* returnSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '10',
    title: 'Letter Combinations of a Phone Number',
    difficulty: 'medium',
    description: 'Given a string containing digits from 2-9, return all possible letter combinations.',
    constraints: ['0 <= digits.length <= 4', 'digits[i] is a digit in the range [2, 9]'],
    testCases: [
      { input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
      { input: 'digits = ""', output: '[]' }
    ],
    starterCode: {
      javascript: 'function letterCombinations(digits) {\n  // Your code here\n}',
      python: 'def letterCombinations(digits):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public List<String> letterCombinations(String digits) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  vector<string> letterCombinations(string digits) {\n    // Your code here\n  }\n};',
      c: 'char** letterCombinations(char* digits, int* returnSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '11',
    title: 'Generate Parentheses',
    difficulty: 'medium',
    description: 'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
    constraints: ['1 <= n <= 8'],
    testCases: [
      { input: 'n = 3', output: '["((()))","(()())","(())()","()(())","()()()"]' },
      { input: 'n = 1', output: '["()"]' }
    ],
    starterCode: {
      javascript: 'function generateParenthesis(n) {\n  // Your code here\n}',
      python: 'def generateParenthesis(n):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public List<String> generateParenthesis(int n) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  vector<string> generateParenthesis(int n) {\n    // Your code here\n  }\n};',
      c: 'char** generateParenthesis(int n, int* returnSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '12',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'medium',
    description: 'Search for a target value in a rotated sorted array.',
    constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i] <= 10^4'],
    testCases: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' }
    ],
    starterCode: {
      javascript: 'function search(nums, target) {\n  // Your code here\n}',
      python: 'def search(nums, target):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public int search(int[] nums, int target) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  int search(vector<int>& nums, int target) {\n    // Your code here\n  }\n};',
      c: 'int search(int* nums, int numsSize, int target) {\n  // Your code here\n}'
    }
  },
  {
    id: '13',
    title: 'Combination Sum',
    difficulty: 'medium',
    description: 'Find all unique combinations of candidates where the chosen numbers sum to target.',
    constraints: ['1 <= candidates.length <= 30', '2 <= candidates[i] <= 40'],
    testCases: [
      { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]' },
      { input: 'candidates = [2,3,5], target = 8', output: '[[2,2,2,2],[2,3,3],[3,5]]' }
    ],
    starterCode: {
      javascript: 'function combinationSum(candidates, target) {\n  // Your code here\n}',
      python: 'def combinationSum(candidates, target):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public List<List<Integer>> combinationSum(int[] candidates, int target) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n    // Your code here\n  }\n};',
      c: 'int** combinationSum(int* candidates, int candidatesSize, int target, int* returnSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '14',
    title: 'Permutations',
    difficulty: 'medium',
    description: 'Given an array nums of distinct integers, return all the possible permutations.',
    constraints: ['1 <= nums.length <= 6', '-10 <= nums[i] <= 10'],
    testCases: [
      { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
      { input: 'nums = [0,1]', output: '[[0,1],[1,0]]' }
    ],
    starterCode: {
      javascript: 'function permute(nums) {\n  // Your code here\n}',
      python: 'def permute(nums):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public List<List<Integer>> permute(int[] nums) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  vector<vector<int>> permute(vector<int>& nums) {\n    // Your code here\n  }\n};',
      c: 'int** permute(int* nums, int numsSize, int* returnSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '15',
    title: 'Rotate Image',
    difficulty: 'medium',
    description: 'You are given an n x n 2D matrix. Rotate the image by 90 degrees clockwise.',
    constraints: ['n == matrix.length', '1 <= n <= 20'],
    testCases: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]' }
    ],
    starterCode: {
      javascript: 'function rotate(matrix) {\n  // Your code here\n}',
      python: 'def rotate(matrix):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public void rotate(int[][] matrix) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  void rotate(vector<vector<int>>& matrix) {\n    // Your code here\n  }\n};',
      c: 'void rotate(int** matrix, int matrixSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '16',
    title: 'Group Anagrams',
    difficulty: 'medium',
    description: 'Group the anagrams together from an array of strings.',
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100'],
    testCases: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }
    ],
    starterCode: {
      javascript: 'function groupAnagrams(strs) {\n  // Your code here\n}',
      python: 'def groupAnagrams(strs):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public List<List<String>> groupAnagrams(String[] strs) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    // Your code here\n  }\n};',
      c: 'char*** groupAnagrams(char** strs, int strsSize, int* returnSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '17',
    title: 'Spiral Matrix',
    difficulty: 'medium',
    description: 'Given an m x n matrix, return all elements of the matrix in spiral order.',
    constraints: ['m == matrix.length', 'n == matrix[i].length', '1 <= m, n <= 10'],
    testCases: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]' }
    ],
    starterCode: {
      javascript: 'function spiralOrder(matrix) {\n  // Your code here\n}',
      python: 'def spiralOrder(matrix):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public List<Integer> spiralOrder(int[][] matrix) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  vector<int> spiralOrder(vector<vector<int>>& matrix) {\n    // Your code here\n  }\n};',
      c: 'int* spiralOrder(int** matrix, int matrixSize, int* returnSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '18',
    title: 'Jump Game',
    difficulty: 'medium',
    description: 'Determine if you can reach the last index of an array.',
    constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5'],
    testCases: [
      { input: 'nums = [2,3,1,1,4]', output: 'true' },
      { input: 'nums = [3,2,1,0,4]', output: 'false' }
    ],
    starterCode: {
      javascript: 'function canJump(nums) {\n  // Your code here\n}',
      python: 'def canJump(nums):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public boolean canJump(int[] nums) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  bool canJump(vector<int>& nums) {\n    // Your code here\n  }\n};',
      c: 'bool canJump(int* nums, int numsSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '19',
    title: 'Unique Paths',
    difficulty: 'medium',
    description: 'Return the number of possible unique paths from top-left to bottom-right of an m x n grid.',
    constraints: ['1 <= m, n <= 100'],
    testCases: [
      { input: 'm = 3, n = 7', output: '28' },
      { input: 'm = 3, n = 2', output: '3' }
    ],
    starterCode: {
      javascript: 'function uniquePaths(m, n) {\n  // Your code here\n}',
      python: 'def uniquePaths(m, n):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public int uniquePaths(int m, int n) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  int uniquePaths(int m, int n) {\n    // Your code here\n  }\n};',
      c: 'int uniquePaths(int m, int n) {\n  // Your code here\n}'
    }
  },
  {
    id: '20',
    title: 'Subsets',
    difficulty: 'medium',
    description: 'Given an integer array nums of unique elements, return all possible subsets.',
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10'],
    testCases: [
      { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' }
    ],
    starterCode: {
      javascript: 'function subsets(nums) {\n  // Your code here\n}',
      python: 'def subsets(nums):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public List<List<Integer>> subsets(int[] nums) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  vector<vector<int>> subsets(vector<int>& nums) {\n    // Your code here\n  }\n};',
      c: 'int** subsets(int* nums, int numsSize, int* returnSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '21',
    title: 'Word Search',
    difficulty: 'medium',
    description: 'Return true if word exists in the grid.',
    constraints: ['m == board.length', 'n == board[i].length', '1 <= m, n <= 6'],
    testCases: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"]], word = "ABCCED"', output: 'true' }
    ],
    starterCode: {
      javascript: 'function exist(board, word) {\n  // Your code here\n}',
      python: 'def exist(board, word):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public boolean exist(char[][] board, String word) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  bool exist(vector<vector<char>>& board, string word) {\n    // Your code here\n  }\n};',
      c: 'bool exist(char** board, int boardSize, char* word) {\n  // Your code here\n}'
    }
  },
  {
    id: '22',
    title: 'Decode Ways',
    difficulty: 'medium',
    description: 'Return the number of ways to decode a string containing only digits.',
    constraints: ['1 <= s.length <= 100', 's contains only digits'],
    testCases: [
      { input: 's = "12"', output: '2' },
      { input: 's = "226"', output: '3' }
    ],
    starterCode: {
      javascript: 'function numDecodings(s) {\n  // Your code here\n}',
      python: 'def numDecodings(s):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public int numDecodings(String s) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  int numDecodings(string s) {\n    // Your code here\n  }\n};',
      c: 'int numDecodings(char* s) {\n  // Your code here\n}'
    }
  },
  {
    id: '23',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'medium',
    description: 'Return the level order traversal of a binary tree.',
    constraints: ['The number of nodes in the tree is in the range [0, 2000]'],
    testCases: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' }
    ],
    starterCode: {
      javascript: 'function levelOrder(root) {\n  // Your code here\n}',
      python: 'def levelOrder(root):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public List<List<Integer>> levelOrder(TreeNode root) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  vector<vector<int>> levelOrder(TreeNode* root) {\n    // Your code here\n  }\n};',
      c: 'int** levelOrder(struct TreeNode* root, int* returnSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '24',
    title: 'Construct Binary Tree',
    difficulty: 'medium',
    description: 'Construct a binary tree from preorder and inorder traversals.',
    constraints: ['1 <= preorder.length <= 3000', 'inorder.length == preorder.length'],
    testCases: [
      { input: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]', output: '[3,9,20,null,null,15,7]' }
    ],
    starterCode: {
      javascript: 'function buildTree(preorder, inorder) {\n  // Your code here\n}',
      python: 'def buildTree(preorder, inorder):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public TreeNode buildTree(int[] preorder, int[] inorder) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {\n    // Your code here\n  }\n};',
      c: 'struct TreeNode* buildTree(int* preorder, int preorderSize, int* inorder, int inorderSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '25',
    title: 'Kth Smallest Element in BST',
    difficulty: 'medium',
    description: 'Return the kth smallest value in a BST.',
    constraints: ['The number of nodes in the tree is n', '1 <= k <= n <= 10^4'],
    testCases: [
      { input: 'root = [3,1,4,null,2], k = 1', output: '1' }
    ],
    starterCode: {
      javascript: 'function kthSmallest(root, k) {\n  // Your code here\n}',
      python: 'def kthSmallest(root, k):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public int kthSmallest(TreeNode root, int k) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  int kthSmallest(TreeNode* root, int k) {\n    // Your code here\n  }\n};',
      c: 'int kthSmallest(struct TreeNode* root, int k) {\n  // Your code here\n}'
    }
  },
  // Hard Problems (10)
  {
    id: '26',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'hard',
    description: 'Find the median of two sorted arrays with O(log(m+n)) time complexity.',
    constraints: ['nums1.length == m', 'nums2.length == n', '0 <= m <= 1000'],
    testCases: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.50000' }
    ],
    starterCode: {
      javascript: 'function findMedianSortedArrays(nums1, nums2) {\n  // Your code here\n}',
      python: 'def findMedianSortedArrays(nums1, nums2):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    // Your code here\n  }\n};',
      c: 'double findMedianSortedArrays(int* nums1, int nums1Size, int* nums2, int nums2Size) {\n  // Your code here\n}'
    }
  },
  {
    id: '27',
    title: 'Merge k Sorted Lists',
    difficulty: 'hard',
    description: 'Merge k sorted linked-lists into one sorted linked-list.',
    constraints: ['k == lists.length', '0 <= k <= 10^4'],
    testCases: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' }
    ],
    starterCode: {
      javascript: 'function mergeKLists(lists) {\n  // Your code here\n}',
      python: 'def mergeKLists(lists):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public ListNode mergeKLists(ListNode[] lists) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  ListNode* mergeKLists(vector<ListNode*>& lists) {\n    // Your code here\n  }\n};',
      c: 'struct ListNode* mergeKLists(struct ListNode** lists, int listsSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '28',
    title: 'Trapping Rain Water',
    difficulty: 'hard',
    description: 'Compute how much water can be trapped after raining.',
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4'],
    testCases: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }
    ],
    starterCode: {
      javascript: 'function trap(height) {\n  // Your code here\n}',
      python: 'def trap(height):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public int trap(int[] height) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  int trap(vector<int>& height) {\n    // Your code here\n  }\n};',
      c: 'int trap(int* height, int heightSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '29',
    title: 'Wildcard Matching',
    difficulty: 'hard',
    description: 'Implement wildcard pattern matching with support for ? and *.',
    constraints: ['0 <= s.length, p.length <= 2000'],
    testCases: [
      { input: 's = "aa", p = "a"', output: 'false' },
      { input: 's = "aa", p = "*"', output: 'true' }
    ],
    starterCode: {
      javascript: 'function isMatch(s, p) {\n  // Your code here\n}',
      python: 'def isMatch(s, p):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public boolean isMatch(String s, String p) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  bool isMatch(string s, string p) {\n    // Your code here\n  }\n};',
      c: 'bool isMatch(char* s, char* p) {\n  // Your code here\n}'
    }
  },
  {
    id: '30',
    title: 'N-Queens',
    difficulty: 'hard',
    description: 'Return all distinct solutions to the n-queens puzzle.',
    constraints: ['1 <= n <= 9'],
    testCases: [
      { input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' }
    ],
    starterCode: {
      javascript: 'function solveNQueens(n) {\n  // Your code here\n}',
      python: 'def solveNQueens(n):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public List<List<String>> solveNQueens(int n) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  vector<vector<string>> solveNQueens(int n) {\n    // Your code here\n  }\n};',
      c: 'char*** solveNQueens(int n, int* returnSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '31',
    title: 'Word Ladder',
    difficulty: 'hard',
    description: 'Return the length of the shortest transformation sequence from beginWord to endWord.',
    constraints: ['1 <= beginWord.length <= 10', 'endWord.length == beginWord.length'],
    testCases: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5' }
    ],
    starterCode: {
      javascript: 'function ladderLength(beginWord, endWord, wordList) {\n  // Your code here\n}',
      python: 'def ladderLength(beginWord, endWord, wordList):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n    // Your code here\n  }\n};',
      c: 'int ladderLength(char* beginWord, char* endWord, char** wordList, int wordListSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '32',
    title: 'Word Break II',
    difficulty: 'hard',
    description: 'Return all possible sentences where each word is a valid dictionary word.',
    constraints: ['1 <= s.length <= 20', '1 <= wordDict.length <= 1000'],
    testCases: [
      { input: 's = "catsanddog", wordDict = ["cat","cats","and","sand","dog"]', output: '["cats and dog","cat sand dog"]' }
    ],
    starterCode: {
      javascript: 'function wordBreak(s, wordDict) {\n  // Your code here\n}',
      python: 'def wordBreak(s, wordDict):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public List<String> wordBreak(String s, List<String> wordDict) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  vector<string> wordBreak(string s, vector<string>& wordDict) {\n    // Your code here\n  }\n};',
      c: 'char** wordBreak(char* s, char** wordDict, int wordDictSize, int* returnSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '33',
    title: 'Largest Rectangle in Histogram',
    difficulty: 'hard',
    description: 'Return the area of the largest rectangle in the histogram.',
    constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
    testCases: [
      { input: 'heights = [2,1,5,6,2,3]', output: '10' }
    ],
    starterCode: {
      javascript: 'function largestRectangleArea(heights) {\n  // Your code here\n}',
      python: 'def largestRectangleArea(heights):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public int largestRectangleArea(int[] heights) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  int largestRectangleArea(vector<int>& heights) {\n    // Your code here\n  }\n};',
      c: 'int largestRectangleArea(int* heights, int heightsSize) {\n  // Your code here\n}'
    }
  },
  {
    id: '34',
    title: 'Minimum Window Substring',
    difficulty: 'hard',
    description: 'Return the minimum window substring of s such that every character in t is included.',
    constraints: ['m == s.length', 'n == t.length', '1 <= m, n <= 10^5'],
    testCases: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' }
    ],
    starterCode: {
      javascript: 'function minWindow(s, t) {\n  // Your code here\n}',
      python: 'def minWindow(s, t):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public String minWindow(String s, String t) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  string minWindow(string s, string t) {\n    // Your code here\n  }\n};',
      c: 'char* minWindow(char* s, char* t) {\n  // Your code here\n}'
    }
  },
  {
    id: '35',
    title: 'Regular Expression Matching',
    difficulty: 'hard',
    description: 'Implement regular expression matching with support for . and *.',
    constraints: ['1 <= s.length <= 20', '1 <= p.length <= 20'],
    testCases: [
      { input: 's = "aa", p = "a"', output: 'false' },
      { input: 's = "aa", p = "a*"', output: 'true' }
    ],
    starterCode: {
      javascript: 'function isMatch(s, p) {\n  // Your code here\n}',
      python: 'def isMatch(s, p):\n    # Your code here\n    pass',
      java: 'class Solution {\n  public boolean isMatch(String s, String p) {\n    // Your code here\n  }\n}',
      cpp: 'class Solution {\npublic:\n  bool isMatch(string s, string p) {\n    // Your code here\n  }\n};',
      c: 'bool isMatch(char* s, char* p) {\n  // Your code here\n}'
    }
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { difficulty } = await req.json();

    let filteredProblems = codingProblems;
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      filteredProblems = codingProblems.filter(p => p.difficulty === difficulty);
    }

    const randomProblem = filteredProblems[Math.floor(Math.random() * filteredProblems.length)];

    return new Response(
      JSON.stringify({ success: true, problem: randomProblem }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error generating problem:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});