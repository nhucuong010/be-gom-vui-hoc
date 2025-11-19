import type { BunnyRescueLevel } from '../types';

export const bunnyRescueLevels: BunnyRescueLevel[] = [
  {
    level: 1,
    steps: [
      { problem: '2 + 1', options: [2, 3, 4], answer: 3, operation: 'add', num1: 2, num2: 1 },
      { problem: '4 - 1', options: [2, 3, 4], answer: 3, operation: 'subtract', num1: 4, num2: 1 },
      { problem: '3 + 2', options: [4, 5, 6], answer: 5, operation: 'add', num1: 3, num2: 2 },
      { problem: '5 - 2', options: [3, 4, 5], answer: 3, operation: 'subtract', num1: 5, num2: 2 },
      { problem: '4 + 1', options: [5, 6, 7], answer: 5, operation: 'add', num1: 4, num2: 1 },
    ]
  },
  {
    level: 2,
    steps: [
      { problem: '3 + 3', options: [5, 6, 7], answer: 6, operation: 'add', num1: 3, num2: 3 },
      { problem: '6 - 2', options: [3, 4, 5], answer: 4, operation: 'subtract', num1: 6, num2: 2 },
      { problem: '5 + 2', options: [6, 7, 8], answer: 7, operation: 'add', num1: 5, num2: 2 },
      { problem: '7 - 3', options: [3, 4, 5], answer: 4, operation: 'subtract', num1: 7, num2: 3 },
      { problem: '4 + 4', options: [7, 8, 9], answer: 8, operation: 'add', num1: 4, num2: 4 },
    ]
  },
  {
    level: 3,
    steps: [
      { problem: '5 + 4', options: [7, 8, 9], answer: 9, operation: 'add', num1: 5, num2: 4 },
      { problem: '9 - 3', options: [5, 6, 7], answer: 6, operation: 'subtract', num1: 9, num2: 3 },
      { problem: '6 + 2', options: [7, 8, 9], answer: 8, operation: 'add', num1: 6, num2: 2 },
      { problem: '8 - 5', options: [2, 3, 4], answer: 3, operation: 'subtract', num1: 8, num2: 5 },
      { problem: '7 + 3', options: [9, 10, 11], answer: 10, operation: 'add', num1: 7, num2: 3 },
    ]
  },
  {
    level: 4,
    steps: [
      { problem: '4 + 5', options: [8, 9, 10], answer: 9, operation: 'add', num1: 4, num2: 5 },
      { problem: '8 - 4', options: [3, 4, 5], answer: 4, operation: 'subtract', num1: 8, num2: 4 },
      { problem: '6 + 3', options: [8, 9, 10], answer: 9, operation: 'add', num1: 6, num2: 3 },
      { problem: '10 - 2', options: [7, 8, 9], answer: 8, operation: 'subtract', num1: 10, num2: 2 },
      { problem: '5 + 5', options: [9, 10, 11], answer: 10, operation: 'add', num1: 5, num2: 5 },
    ]
  }
];