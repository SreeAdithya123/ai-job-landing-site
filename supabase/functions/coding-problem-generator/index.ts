import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

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
      javascript: `function twoSum(nums, target) {\n  // Your code here\n}`,
      python: `def twoSum(nums, target):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n  }\n};`,
      c: `int* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n  // Your code here\n}`
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
      javascript: `function isPalindrome(x) {\n  // Your code here\n}`,
      python: `def isPalindrome(x):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public boolean isPalindrome(int x) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  bool isPalindrome(int x) {\n    // Your code here\n  }\n};`,
      c: `bool isPalindrome(int x) {\n  // Your code here\n}`
    }
  },
  {
    id: '3',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    description: 'Given a string s containing just the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets, and open brackets must be closed in the correct order.',
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only "()[]{}"'],
    testCases: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    starterCode: {
      javascript: `function isValid(s) {\n  // Your code here\n}`,
      python: `def isValid(s):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public boolean isValid(String s) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  bool isValid(string s) {\n    // Your code here\n  }\n};`,
      c: `bool isValid(char* s) {\n  // Your code here\n}`
    }
  },
  {
    id: '4',
    title: 'Merge Two Sorted Lists',
    difficulty: 'easy',
    description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.',
    constraints: ['The number of nodes in both lists is in the range [0, 50]', '-100 <= Node.val <= 100', 'Both list1 and list2 are sorted in non-decreasing order'],
    testCases: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
      { input: 'list1 = [], list2 = []', output: '[]' },
      { input: 'list1 = [], list2 = [0]', output: '[0]' }
    ],
    starterCode: {
      javascript: `function mergeTwoLists(list1, list2) {\n  // Your code here\n}`,
      python: `def mergeTwoLists(list1, list2):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    // Your code here\n  }\n};`,
      c: `struct ListNode* mergeTwoLists(struct ListNode* list1, struct ListNode* list2) {\n  // Your code here\n}`
    }
  },
  {
    id: '5',
    title: 'Remove Duplicates from Sorted Array',
    difficulty: 'easy',
    description: 'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements in nums.',
    constraints: ['1 <= nums.length <= 3 * 10^4', '-100 <= nums[i] <= 100', 'nums is sorted in non-decreasing order'],
    testCases: [
      { input: 'nums = [1,1,2]', output: '2, nums = [1,2,_]' },
      { input: 'nums = [0,0,1,1,1,2,2,3,3,4]', output: '5, nums = [0,1,2,3,4,_,_,_,_,_]' }
    ],
    starterCode: {
      javascript: `function removeDuplicates(nums) {\n  // Your code here\n}`,
      python: `def removeDuplicates(nums):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public int removeDuplicates(int[] nums) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  int removeDuplicates(vector<int>& nums) {\n    // Your code here\n  }\n};`,
      c: `int removeDuplicates(int* nums, int numsSize) {\n  // Your code here\n}`
    }
  },
  // Medium Problems (20)
  {
    id: '6',
    title: 'Add Two Numbers',
    difficulty: 'medium',
    description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
    constraints: ['The number of nodes in each linked list is in the range [1, 100]', '0 <= Node.val <= 9', 'It is guaranteed that the list represents a number that does not have leading zeros'],
    testCases: [
      { input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]', explanation: '342 + 465 = 807' },
      { input: 'l1 = [0], l2 = [0]', output: '[0]' },
      { input: 'l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]', output: '[8,9,9,9,0,0,0,1]' }
    ],
    starterCode: {
      javascript: `function addTwoNumbers(l1, l2) {\n  // Your code here\n}`,
      python: `def addTwoNumbers(l1, l2):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n    // Your code here\n  }\n};`,
      c: `struct ListNode* addTwoNumbers(struct ListNode* l1, struct ListNode* l2) {\n  // Your code here\n}`
    }
  },
  {
    id: '7',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces'],
    testCases: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' }
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  // Your code here\n}`,
      python: `def lengthOfLongestSubstring(s):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public int lengthOfLongestSubstring(String s) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  int lengthOfLongestSubstring(string s) {\n    // Your code here\n  }\n};`,
      c: `int lengthOfLongestSubstring(char* s) {\n  // Your code here\n}`
    }
  },
  {
    id: '8',
    title: '3Sum',
    difficulty: 'medium',
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
    constraints: ['0 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    testCases: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'The solution set must not contain duplicate triplets.' },
      { input: 'nums = []', output: '[]' },
      { input: 'nums = [0]', output: '[]' }
    ],
    starterCode: {
      javascript: `function threeSum(nums) {\n  // Your code here\n}`,
      python: `def threeSum(nums):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public List<List<Integer>> threeSum(int[] nums) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  vector<vector<int>> threeSum(vector<int>& nums) {\n    // Your code here\n  }\n};`,
      c: `struct ListNode* threeSum(int* nums, int numsSize) {\n  // Your code here\n}`
    }
  },
  {
    id: '9',
    title: 'Container With Most Water',
    difficulty: 'medium',
    description: 'Given n non-negative integers a1, a2, ..., an where each represents a point at coordinate (i, ai). n vertical lines are drawn such that the two endpoints of line i is at (i, ai) and (i, 0). Find two lines, which together with the x-axis forms a container, such that the container contains the most water.',
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    testCases: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'The maximum area of water that can be contained is 49.' },
      { input: 'height = [1,1]', output: '1' }
    ],
    starterCode: {
      javascript: `function maxArea(height) {\n  // Your code here\n}`,
      python: `def maxArea(height):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public int maxArea(int[] height) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  int maxArea(vector<int>& height) {\n    // Your code here\n  }\n};`,
      c: `int maxArea(int* height, int heightSize) {\n  // Your code here\n}`
    }
  },
  {
    id: '10',
    title: 'Integer to Roman',
    difficulty: 'medium',
    description: 'Given an integer, convert it to a roman numeral.',
    constraints: ['1 <= num <= 3999'],
    testCases: [
      { input: 'num = 3', output: 'III' },
      { input: 'num = 4', output: 'IV' },
      { input: 'num = 9', output: 'IX' },
      { input: 'num = 58', output: 'LVIII', explanation: 'L = 50, V = 5, III = 3.' },
      { input: 'num = 1994', output: 'MCMXCIV', explanation: 'M = 1000, CM = 900, XC = 90, IV = 4.' }
    ],
    starterCode: {
      javascript: `function intToRoman(num) {\n  // Your code here\n}`,
      python: `def intToRoman(num):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public String intToRoman(int num) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  string intToRoman(int num) {\n    // Your code here\n  }\n};`,
      c: `char* intToRoman(int num) {\n  // Your code here\n}`
    }
  },
  {
    id: '11',
    title: 'Roman to Integer',
    difficulty: 'medium',
    description: 'Given a roman numeral, convert it to an integer.',
    constraints: ['1 <= s.length <= 15', 's consists of the characters ("I", "V", "X", "L", "C", "D", "M")'],
    testCases: [
      { input: 's = "III"', output: '3' },
      { input: 's = "IV"', output: '4' },
      { input: 's = "IX"', output: '9' },
      { input: 's = "LVIII"', output: '58', explanation: 'L = 50, V = 5, III = 3.' },
      { input: 's = "MCMXCIV"', output: '1994', explanation: 'M = 1000, CM = 900, XC = 90, IV = 4.' }
    ],
    starterCode: {
      javascript: `function romanToInt(s) {\n  // Your code here\n}`,
      python: `def romanToInt(s):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public int romanToInt(String s) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  int romanToInt(string s) {\n    // Your code here\n  }\n};`,
      c: `int romanToInt(char* s) {\n  // Your code here\n}`
    }
  },
  {
    id: '12',
    title: 'Longest Common Prefix',
    difficulty: 'medium',
    description: 'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".',
    constraints: ['0 <= strs.length <= 200', '0 <= strs[i].length <= 200', 'strs[i] consists of only lowercase English letters'],
    testCases: [
      { input: 'strs = ["flower","flow","flight"]', output: 'fl' },
      { input: 'strs = ["dog","racecar","car"]', output: '' }
    ],
    starterCode: {
      javascript: `function longestCommonPrefix(strs) {\n  // Your code here\n}`,
      python: `def longestCommonPrefix(strs):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public String longestCommonPrefix(String[] strs) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  string longestCommonPrefix(vector<string>& strs) {\n    // Your code here\n  }\n};`,
      c: `char* longestCommonPrefix(char** strs, int strsSize) {\n  // Your code here\n}`
    }
  },
  {
    id: '13',
    title: 'Valid Anagram',
    difficulty: 'medium',
    description: 'Given two strings s and t, return true if t is an anagram of s and false otherwise.',
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters'],
    testCases: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' }
    ],
    starterCode: {
      javascript: `function isAnagram(s, t) {\n  // Your code here\n}`,
      python: `def isAnagram(s, t):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public boolean isAnagram(String s, String t) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  bool isAnagram(string s, string t) {\n    // Your code here\n  }\n};`,
      c: `bool isAnagram(char* s, char* t) {\n  // Your code here\n}`
    }
  },
  {
    id: '14',
    title: 'Group Anagrams',
    difficulty: 'medium',
    description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters'],
    testCases: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', output: '[[""]]' },
      { input: 'strs = ["a"]', output: '[["a"]]' }
    ],
    starterCode: {
      javascript: `function groupAnagrams(strs) {\n  // Your code here\n}`,
      python: `def groupAnagrams(strs):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public List<List<String>> groupAnagrams(String[] strs) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  vector<vector<string>> groupAnagrams(vector<string>& strs) {\n    // Your code here\n  }\n};`,
      c: `struct ListNode* groupAnagrams(char** strs, int strsSize) {\n  // Your code here\n}`
    }
  },
  {
    id: '15',
    title: 'Top K Frequent Elements',
    difficulty: 'medium',
    description: 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.',
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in the range [1, the number of unique elements in the array]'],
    testCases: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' },
      { input: 'nums = [1], k = 1', output: '[1]' }
    ],
    starterCode: {
      javascript: `function topKFrequent(nums, k) {\n  // Your code here\n}`,
      python: `def topKFrequent(nums, k):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public List<Integer> topKFrequent(int[] nums, int k) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  vector<int> topKFrequent(vector<int>& nums, int k) {\n    // Your code here\n  }\n};`,
      c: `int* topKFrequent(int* nums, int numsSize, int k, int* returnSize) {\n  // Your code here\n}`
    }
  },
  {
    id: '16',
    title: 'Merge Intervals',
    difficulty: 'medium',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= starti <= endi <= 10^4'],
    testCases: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]' }
    ],
    starterCode: {
      javascript: `function merge(intervals) {\n  // Your code here\n}`,
      python: `def merge(intervals):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public int[][] merge(int[][] intervals) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  vector<vector<int>> merge(vector<vector<int>>& intervals) {\n    // Your code here\n  }\n};`,
      c: `struct ListNode* merge(int** intervals, int intervalsSize, int* intervalsColSize) {\n  // Your code here\n}`
    }
  },
  {
    id: '17',
    title: 'Rotate Array',
    difficulty: 'medium',
    description: 'Given an array, rotate the array to the right by k steps, where k is non-negative.',
    constraints: ['1 <= nums.length <= 10^2', '0 <= nums[i] <= 10^3', '0 <= k <= 10^5'],
    testCases: [
      { input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]' },
      { input: 'nums = [-1,-100,3,99], k = 2', output: '[3,99,-1,-100]' }
    ],
    starterCode: {
      javascript: `function rotate(nums, k) {\n  // Your code here\n}`,
      python: `def rotate(nums, k):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public void rotate(int[] nums, int k) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  void rotate(vector<int>& nums, int k) {\n    // Your code here\n  }\n};`,
      c: `void rotate(int* nums, int numsSize, int k) {\n  // Your code here\n}`
    }
  },
  {
    id: '18',
    title: 'Find Minimum in Rotated Sorted Array',
    difficulty: 'medium',
    description: 'Suppose an array sorted in ascending order is rotated at some pivot unknown to you beforehand. You may assume no duplicates exist in the array. Find the minimum element.',
    constraints: ['n == nums.length', '1 <= n <= 5000', '-5000 <= nums[i] <= 5000'],
    testCases: [
      { input: 'nums = [3,4,5,1,2]', output: '1' },
      { input: 'nums = [4,5,6,7,0,1,2]', output: '0' },
      { input: 'nums = [1]', output: '1' }
    ],
    starterCode: {
      javascript: `function findMin(nums) {\n  // Your code here\n}`,
      python: `def findMin(nums):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public int findMin(int[] nums) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  int findMin(vector<int>& nums) {\n    // Your code here\n  }\n};`,
      c: `int findMin(int* nums, int numsSize) {\n  // Your code here\n}`
    }
  },
  {
    id: '19',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'medium',
    description: 'You are given an integer array nums sorted in ascending order, and an integer target. Suppose that nums is rotated at some pivot unknown to you beforehand. You should search for target in nums and return its index if target exists, otherwise, return -1.',
    constraints: ['n == nums.length', '1 <= n <= 5000', '-5000 <= nums[i] <= 5000'],
    testCases: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' }
    ],
    starterCode: {
      javascript: `function search(nums, target) {\n  // Your code here\n}`,
      python: `def search(nums, target):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public int search(int[] nums, int target) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  int search(vector<int>& nums, int target) {\n    // Your code here\n  }\n};`,
      c: `int search(int* nums, int numsSize, int target) {\n  // Your code here\n}`
    }
  },
  {
    id: '20',
    title: 'Combination Sum',
    difficulty: 'medium',
    description: 'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.',
    constraints: ['1 <= candidates.length <= 30', '1 <= candidates[i] <= 200', 'All elements of candidates are distinct.', '0 <= target <= 500'],
    testCases: [
      { input: 'candidates = [10,1,2,7,6,1,5], target = 8', output: '[[1,1,6],[1,2,5],[2,6],[1,7]]' },
      { input: 'candidates = [2,5,2,1,2], target = 5', output: '[[1,2,2],[5]]' }
    ],
    starterCode: {
      javascript: `function combinationSum(candidates, target) {\n  // Your code here\n}`,
      python: `def combinationSum(candidates, target):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public List<List<Integer>> combinationSum(int[] candidates, int target) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n    // Your code here\n  }\n};`,
      c: `struct ListNode* combinationSum(int* candidates, int candidatesSize, int target) {\n  // Your code here\n}`
    }
  },
  // Hard Problems (10)
  {
    id: '21',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'hard',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
    constraints: ['m == nums1.length', 'n == nums2.length', '0 <= m <= 1000', '0 <= n <= 1000', '-10^6 <= nums1[i], nums2[i] <= 10^6'],
    testCases: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000', explanation: 'The median is 2.0.' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.50000', explanation: 'The median is (2 + 3)/2 = 2.5.' },
      { input: 'nums1 = [0,0], nums2 = [0,0]', output: '0.00000' }
    ],
    starterCode: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {\n  // Your code here\n}`,
      python: `def findMedianSortedArrays(nums1, nums2):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n    // Your code here\n  }\n};`,
      c: `double findMedianSortedArrays(int* nums1, int nums1Size, int* nums2, int nums2Size) {\n  // Your code here\n}`
    }
  },
  {
    id: '22',
    title: 'Longest Valid Parentheses',
    difficulty: 'hard',
    description: 'Given a string s containing just the characters "(" and ")", return the length of the longest valid (well-formed) parentheses substring.',
    constraints: ['0 <= s.length <= 3 * 10^4'],
    testCases: [
      { input: 's = "(()"', output: '2', explanation: 'The longest valid parentheses substring is "()".' },
      { input: 's = ")()())"', output: '4', explanation: 'The longest valid parentheses substring is "()()".' },
      { input: 's = "", output: '0' }
    ],
    starterCode: {
      javascript: `function longestValidParentheses(s) {\n  // Your code here\n}`,
      python: `def longestValidParentheses(s):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public int longestValidParentheses(String s) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  int longestValidParentheses(string s) {\n    // Your code here\n  }\n};`,
      c: `int longestValidParentheses(char* s) {\n  // Your code here\n}`
    }
  },
  {
    id: '23',
    title: 'Trapping Rain Water',
    difficulty: 'hard',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    constraints: ['n == height.length', '0 <= n <= 30000', '0 <= height[i] <= 10000'],
    testCases: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'The trapped water is 6 units.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9', explanation: 'The trapped water is 9 units.' }
    ],
    starterCode: {
      javascript: `function trap(height) {\n  // Your code here\n}`,
      python: `def trap(height):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public int trap(int[] height) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  int trap(vector<int>& height) {\n    // Your code here\n  }\n};`,
      c: `int trap(int* height, int heightSize) {\n  // Your code here\n}`
    }
  },
  {
    id: '24',
    title: 'Longest Consecutive Sequence',
    difficulty: 'hard',
    description: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.',
    constraints: ['0 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9'],
    testCases: [
      { input: 'nums = [100,4,200,1,3,2]', output: '4', explanation: 'The longest consecutive elements sequence is [1, 2, 3, 4].' },
      { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', output: '9' }
    ],
    starterCode: {
      javascript: `function longestConsecutive(nums) {\n  // Your code here\n}`,
      python: `def longestConsecutive(nums):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public int longestConsecutive(int[] nums) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  int longestConsecutive(vector<int>& nums) {\n    // Your code here\n  }\n};`,
      c: `int longestConsecutive(int* nums, int numsSize) {\n  // Your code here\n}`
    }
  },
  {
    id: '25',
    title: 'Word Ladder II',
    difficulty: 'hard',
    description: 'Given two words, beginWord and endWord, and a dictionary wordList, return all the shortest transformation sequences from beginWord to endWord, or an empty list if no such sequence exists.',
    constraints: ['1 <= beginWord.length, endWord.length <= 10', '1 <= wordList.length <= 500', 'beginWord, endWord, and words in wordList consist of lowercase English letters.', 'beginWord != endWord'],
    testCases: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '[["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]' },
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: '[]' }
    ],
    starterCode: {
      javascript: `function findLadders(beginWord, endWord, wordList) {\n  // Your code here\n}`,
      python: `def findLadders(beginWord, endWord, wordList):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public List<List<String>> findLadders(String beginWord, String endWord, List<String> wordList) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  vector<vector<string>> findLadders(string beginWord, string endWord, vector<string>& wordList) {\n    // Your code here\n  }\n};`,
      c: `struct ListNode* findLadders(char* beginWord, char* endWord, char** wordList, int wordListSize) {\n  // Your code here\n}`
    }
  },
  {
    id: '26',
    title: 'N-Queens',
    difficulty: 'hard',
    description: 'The N-Queens puzzle is the problem of placing N chess queens on an N×N chessboard such that no two queens threaten each other. Given an integer n, return all distinct solutions to the n-queens puzzle.',
    constraints: ['1 <= n <= 9'],
    testCases: [
      { input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' },
      { input: 'n = 1', output: '[["Q"]]' }
    ],
    starterCode: {
      javascript: `function solveNQueens(n) {\n  // Your code here\n}`,
      python: `def solveNQueens(n):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public List<List<String>> solveNQueens(int n) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  vector<vector<string>> solveNQueens(int n) {\n    // Your code here\n  }\n};`,
      c: `struct ListNode* solveNQueens(int n) {\n  // Your code here\n}`
    }
  },
  {
    id: '27',
    title: 'Sudoku Solver',
    difficulty: 'hard',
    description: 'Write a program to solve a Sudoku puzzle by filling the empty cells.',
    constraints: ['board.length == 9', 'board[i].length == 9', 'board[i][j] is a digit or "."', 'It is guaranteed that the input board has only one solution.'],
    testCases: [
      { input: 'board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]', output: '[["5","3","4","6","7","8","9","1","2"],["6","7","2","1","9","5","3","4","8"],["1","9","8","3","4","2","5","6","7"],["8","5","9","7","6","1","4","2","3"],["4","2","6","8","5","3","7","9","1"],["7","1","3","9","2","4","8","5","6"],["9","6","1","5","3","7","2","8","4"],["2","8","7","4","1","9","6","3","5"],["3","4","5","2","8","6","1","7","9"]]' },
      { input: 'board = [[".",".",".",".","5",".",".",".","."],[".",".",".","1","4",".",".",".","."],[".",".",".",".",".",".",".","2","."],[".",".","1","4",".","6",".",".","."],[".",".",".","1","4",".",".",".","."],[".",".",".","1","4",".",".",".","."],[".",".",".","1","4",".",".",".","."],[".",".",".","1","4",".",".",".","."],[".",".",".","1","4",".",".",".","."]]', output: '[]' }
    ],
    starterCode: {
      javascript: `function solveSudoku(board) {\n  // Your code here\n}`,
      python: `def solveSudoku(board):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public void solveSudoku(char[][] board) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  void solveSudoku(vector<vector<char>>& board) {\n    // Your code here\n  }\n};`,
      c: `void solveSudoku(char board[9][9]) {\n  // Your code here\n}`
    }
  },
  {
    id: '28',
    title: 'Word Search II',
    difficulty: 'hard',
    description: 'Given an m x n board of characters and a list of strings words, return all words on the board.',
    constraints: ['m == board.length', 'n == board[i].length', '1 <= m, n <= 12', '1 <= words.length <= 3 * 10^4', '1 <= words[i].length <= 10', 'board[i][j] is a lowercase English letter', 'All the strings of words are unique.'],
    testCases: [
      { input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', output: '["eat","oath"]' },
      { input: 'board = [["a","b"],["c","d"]], words = ["abcb"]', output: '[]' }
    ],
    starterCode: {
      javascript: `function findWords(board, words) {\n  // Your code here\n}`,
      python: `def findWords(board, words):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public List<String> findWords(char[][] board, String[] words) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {\n    // Your code here\n  }\n};`,
      c: `struct ListNode* findWords(char board[12][12], char** words, int wordsSize) {\n  // Your code here\n}`
    }
  },
  {
    id: '29',
    title: 'Minimum Window Substring',
    difficulty: 'hard',
    description: 'Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".',
    constraints: ['0 <= s.length <= 1000', '0 <= t.length <= 1000', 's and t consist of English letters and digits.'],
    testCases: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: "BANC" },
      { input: 's = "a", t = "aa"', output: "" }
    ],
    starterCode: {
      javascript: `function minWindow(s, t) {\n  // Your code here\n}`,
      python: `def minWindow(s, t):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public String minWindow(String s, String t) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  string minWindow(string s, string t) {\n    // Your code here\n  }\n};`,
      c: `char* minWindow(char* s, char* t) {\n  // Your code here\n}`
    }
  },
  {
    id: '30',
    title: 'Palindrome Partitioning II',
    difficulty: 'hard',
    description: 'Given a string s, partition s such that every substring of the partition is a palindrome. Return the minimum cuts needed for a palindrome partitioning of s.',
    constraints: ['1 <= s.length <= 2000', 's consists of lowercase English letters.'],
    testCases: [
      { input: 's = "aab"', output: '1', explanation: 'The palindrome partitioning ["aa","b"] could be produced using 1 cut.' },
      { input: 's = "a"', output: '0' }
    ],
    starterCode: {
      javascript: `function minCut(s) {\n  // Your code here\n}`,
      python: `def minCut(s):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public int minCut(String s) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  int minCut(string s) {\n    // Your code here\n  }\n};`,
      c: `int minCut(char* s) {\n  // Your code here\n}`
    }
  },
  {
    id: '31',
    title: 'Regular Expression Matching',
    difficulty: 'hard',
    description: 'Given an input string s and a pattern p, implement regular expression matching with support for "." and "*".',
    constraints: ['0 <= s.length <= 20', '0 <= p.length <= 20'],
    testCases: [
      { input: 's = "aa", p = "a"', output: 'false' },
      { input: 's = "aa", p = "a*"', output: 'true' },
      { input: 's = "ab", p = ".*"', output: 'true' }
    ],
    starterCode: {
      javascript: `function isMatch(s, p) {\n  // Your code here\n}`,
      python: `def isMatch(s, p):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public boolean isMatch(String s, String p) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  bool isMatch(string s, string p) {\n    // Your code here\n  }\n};`,
      c: `bool isMatch(char* s, char* p) {\n  // Your code here\n}`
    }
  },
  {
    id: '32',
    title: 'Edit Distance',
    difficulty: 'hard',
    description: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.',
    constraints: ['1 <= word1.length, word2.length <= 500', 'word1 and word2 consist of lowercase English letters.'],
    testCases: [
      { input: 'word1 = "horse", word2 = "ros"', output: '3', explanation: 'horse -> rorse (replace h with r), rorse -> rose (remove r), rose -> ros (remove e).' },
      { input: 'word1 = "intention", word2 = "execution"', output: '5' }
    ],
    starterCode: {
      javascript: `function minDistance(word1, word2) {\n  // Your code here\n}`,
      python: `def minDistance(word1, word2):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public int minDistance(String word1, String word2) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  int minDistance(string word1, string word2) {\n    // Your code here\n  }\n};`,
      c: `int minDistance(char* word1, char* word2) {\n  // Your code here\n}`
    }
  },
  {
    id: '33',
    title: 'Scramble String',
    difficulty: 'hard',
    description: 'We can scramble a string s to get a string t using the following algorithm: We can choose any non-empty substring of s, and then swap two characters of the substring. We can repeat this process as many times as we want to transform s into t. Given two strings s and t, return true if s can be scrambled to be equal to t, or false otherwise.',
    constraints: ['1 <= s.length <= 30', 's and t consist of lowercase English letters.'],
    testCases: [
      { input: 's = "great", t = "rgeat"', output: 'true' },
      { input: 's = "abcde", t = "caebd"', output: 'false' }
    ],
    starterCode: {
      javascript: `function isScramble(s, t) {\n  // Your code here\n}`,
      python: `def isScramble(s, t):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public boolean isScramble(String s, String t) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  bool isScramble(string s, string t) {\n    // Your code here\n  }\n};`,
      c: `bool isScramble(char* s, char* t) {\n  // Your code here\n}`
    }
  },
  {
    id: '34',
    title: 'Palindrome Pairs',
    difficulty: 'hard',
    description: 'Given a list of unique words, return all the pairs of distinct indices (i, j) in the given list, so that the concatenation of the two words, i.e. words[i] + words[j] is a palindrome.',
    constraints: ['1 <= words.length <= 5000', '0 <= words[i].length <= 300'],
    testCases: [
      { input: 'words = ["abcd","dcba","lls","s","sssll"]', output: '[[0,1],[1,0],[3,2],[2,4]]' },
      { input: 'words = ["a",""]', output: '[[0,1],[1,0]]' }
    ],
    starterCode: {
      javascript: `function palindromePairs(words) {\n  // Your code here\n}`,
      python: `def palindromePairs(words):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public List<List<Integer>> palindromePairs(String[] words) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  vector<vector<int>> palindromePairs(vector<string>& words) {\n    // Your code here\n  }\n};`,
      c: `struct ListNode* palindromePairs(char** words, int wordsSize) {\n  // Your code here\n}`
    }
  },
  {
    id: '35',
    title: 'Count of Smaller Numbers After Self',
    difficulty: 'hard',
    description: 'Given an integer array nums, return an integer array answer such that answer[i] is the number of smaller elements to the right of nums[i].',
    constraints: ['0 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    testCases: [
      { input: 'nums = [5,2,6,1]', output: '[2,1,1,0]' },
      { input: 'nums = [-1,-1]', output: '[0,0]' }
    ],
    starterCode: {
      javascript: `function countSmaller(nums) {\n  // Your code here\n}`,
      python: `def countSmaller(nums):\n    # Your code here\n    pass`,
      java: `class Solution {\n  public List<Integer> countSmaller(int[] nums) {\n    // Your code here\n  }\n}`,
      cpp: `class Solution {\npublic:\n  vector<int> countSmaller(vector<int>& nums) {\n    // Your code here\n  }\n};`,
      c: `int* countSmaller(int* nums, int numsSize, int* returnSize) {\n  // Your code here\n}`
    }
  },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { difficulty } = await req.json();

    // Filter problems by difficulty if specified
    let filteredProblems = codingProblems;
    if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
      filteredProblems = codingProblems.filter(p => p.difficulty === difficulty);
    }

    // Select a random problem
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
