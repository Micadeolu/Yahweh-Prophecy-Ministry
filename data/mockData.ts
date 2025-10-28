import type { Testimony, Prophet } from '../types';

export const INITIAL_PROPHETS: Prophet[] = [
  {
    id: 'prophet-1',
    username: 'Seer Elijah',
    title: 'Interpreter of Divine Signs',
    whatsapp: '+11234567890',
    email: 'seer.elijah@yahwehministry.com',
    profilePicture: 'https://i.ibb.co/dD1jB4M/prophet1.jpg',
    bankDetails: {
      bankName: 'Zion National Bank',
      accountName: 'Elijah Ministries',
      accountNumber: '1122334455',
    },
    paymentLink: 'https://cash.app/$SeerElijah',
  },
  {
    id: 'admin-1',
    username: 'Admin',
    title: 'Ministry Coordinator',
    whatsapp: '+1000000000',
    email: 'admin@yahwehministry.com',
    profilePicture: 'https://i.ibb.co/6n29x0x/logo.png', // Using logo for admin
    bankDetails: {
      bankName: 'Ministry General Fund',
      accountName: 'Yahweh Prophecy Ministry',
      accountNumber: '9988776655',
    },
  },
];

export const INITIAL_TESTIMONIES: Testimony[] = [
    {
        name: 'Samuel L.',
        text: "The guidance I received was astonishingly accurate. It brought clarity to a situation that had troubled me for months. Truly a divine connection.",
        date: "2023-10-26T10:00:00.000Z"
    },
    {
        name: 'Grace A.',
        text: "Prophetess Anna's words were gentle yet powerful. They provided the comfort and direction my family and I desperately needed. We are forever grateful.",
        date: "2023-11-15T14:30:00.000Z"
    },
    {
        name: 'David O.',
        text: "I was skeptical at first, but the insight from Seer Elijah was undeniable. It unlocked a new perspective on my career path. Thank you, Yahweh Ministry!",
        date: "2024-01-05T09:15:00.000Z"
    }
];