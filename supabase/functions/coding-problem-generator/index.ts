import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const codingProblems = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
    starterCode: {
      python: `def two_sum(nums, target):
    # Your code here
    pass`,
      cpp: `#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
}`,
      c: `#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Your code here
}`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
    }
}`,
      javascript: `function twoSum(nums, target) {
    // Your code here
}`
    }
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'easy',
    description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.

Example:
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]`,
    starterCode: {
      python: `def reverse_string(s):
    # Your code here
    pass`,
      cpp: `#include <vector>
using namespace std;

void reverseString(vector<char>& s) {
    // Your code here
}`,
      c: `#include <stdio.h>

void reverseString(char* s, int sSize) {
    // Your code here
}`,
      java: `class Solution {
    public void reverseString(char[] s) {
        // Your code here
    }
}`,
      javascript: `function reverseString(s) {
    // Your code here
}`
    }
  },
  {
    id: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 'easy',
    description: `Given an integer x, return true if x is a palindrome, and false otherwise.

Example 1:
Input: x = 121
Output: true
Explanation: 121 reads as 121 from left to right and from right to left.

Example 2:
Input: x = -121
Output: false
Explanation: From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.`,
    starterCode: {
      python: `def is_palindrome(x):
    # Your code here
    pass`,
      cpp: `#include <iostream>
using namespace std;

bool isPalindrome(int x) {
    // Your code here
}`,
      c: `#include <stdbool.h>

bool isPalindrome(int x) {
    // Your code here
}`,
      java: `class Solution {
    public boolean isPalindrome(int x) {
        // Your code here
    }
}`,
      javascript: `function isPalindrome(x) {
    // Your code here
}`
    }
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'medium',
    description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

Example:
Input: s = "()[]{}"
Output: true`,
    starterCode: {
      python: `def is_valid(s):
    # Your code here
    pass`,
      cpp: `#include <string>
using namespace std;

bool isValid(string s) {
    // Your code here
}`,
      c: `#include <stdbool.h>

bool isValid(char* s) {
    // Your code here
}`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Your code here
    }
}`,
      javascript: `function isValid(s) {
    // Your code here
}`
    }
  },
  {
    id: 'merge-sorted-arrays',
    title: 'Merge Sorted Array',
    difficulty: 'medium',
    description: `You are given two integer arrays nums1 and nums2, sorted in non-decreasing order. Merge nums2 into nums1 as one sorted array.

The final sorted array should be stored inside the array nums1.

Example:
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]`,
    starterCode: {
      python: `def merge(nums1, m, nums2, n):
    # Your code here
    pass`,
      cpp: `#include <vector>
using namespace std;

void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    // Your code here
}`,
      c: `void merge(int* nums1, int nums1Size, int m, int* nums2, int nums2Size, int n) {
    // Your code here
}`,
      java: `class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        // Your code here
    }
}`,
      javascript: `function merge(nums1, m, nums2, n) {
    // Your code here
}`
    }
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'easy',
    description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.

Example:
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4`,
    starterCode: {
      python: `def search(nums, target):
    # Your code here
    pass`,
      cpp: `#include <vector>
using namespace std;

int search(vector<int>& nums, int target) {
    // Your code here
}`,
      c: `int search(int* nums, int numsSize, int target) {
    // Your code here
}`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Your code here
    }
}`,
      javascript: `function search(nums, target) {
    // Your code here
}`
    }
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    description: `Given a string s, find the length of the longest substring without repeating characters.

Example 1:
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.

Example 2:
Input: s = "pwwkew"
Output: 3
Explanation: The answer is "wke", with the length of 3.`,
    starterCode: {
      python: `def length_of_longest_substring(s):
    # Your code here
    pass`,
      cpp: `#include <string>
using namespace std;

int lengthOfLongestSubstring(string s) {
    // Your code here
}`,
      c: `int lengthOfLongestSubstring(char* s) {
    // Your code here
}`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Your code here
    }
}`,
      javascript: `function lengthOfLongestSubstring(s) {
    // Your code here
}`
    }
  },
  {
    id: 'max-subarray',
    title: 'Maximum Subarray',
    difficulty: 'medium',
    description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

Example:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.`,
    starterCode: {
      python: `def max_sub_array(nums):
    # Your code here
    pass`,
      cpp: `#include <vector>
using namespace std;

int maxSubArray(vector<int>& nums) {
    // Your code here
}`,
      c: `int maxSubArray(int* nums, int numsSize) {
    // Your code here
}`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Your code here
    }
}`,
      javascript: `function maxSubArray(nums) {
    // Your code here
}`
    }
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'easy',
    description: `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

Example:
Input: n = 3
Output: 3
Explanation: There are three ways to climb to the top:
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step`,
    starterCode: {
      python: `def climb_stairs(n):
    # Your code here
    pass`,
      cpp: `int climbStairs(int n) {
    // Your code here
}`,
      c: `int climbStairs(int n) {
    // Your code here
}`,
      java: `class Solution {
    public int climbStairs(int n) {
        // Your code here
    }
}`,
      javascript: `function climbStairs(n) {
    // Your code here
}`
    }
  },
  {
    id: 'best-time-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'easy',
    description: `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

Example:
Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.`,
    starterCode: {
      python: `def max_profit(prices):
    # Your code here
    pass`,
      cpp: `#include <vector>
using namespace std;

int maxProfit(vector<int>& prices) {
    // Your code here
}`,
      c: `int maxProfit(int* prices, int pricesSize) {
    // Your code here
}`,
      java: `class Solution {
    public int maxProfit(int[] prices) {
        // Your code here
    }
}`,
      javascript: `function maxProfit(prices) {
    // Your code here
}`
    }
  }
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