export interface DreamFormData {
  fullName: string;
whatsapp?: string;
  dreamDescription: string;
  feelingOnWaking: string;
}

export interface AdminContact {
  whatsapp: string;
  email: string;
}

// Fix: Added export for the User interface.
export interface User {
    fullName: string;
    whatsapp: string;
}

// Fix: Added export for the Testimony interface.
export interface Testimony {
    name: string;
    text: string;
date: string;
}

// Fix: Add missing type definitions for Prophet, InsightFormData, and ProphecyRequest to resolve import errors.
export interface Prophet {
  id: string;
  username: string;
  title: string;
  whatsapp: string;
  email: string;
  profilePicture: string;
bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
  };
  paymentLink?: string;
}

export interface InsightFormData {
  relationship: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
  location: string;
  request: string;
  fullName: string;
whatsapp?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  author?: 'prophet' | 'AI Assistant';
}

export interface ProphecyRequest {
  id: string;
  timestamp: string;
  requestType: 'insight';
  formData: InsightFormData;
  chatHistory: ChatMessage[];
  prophetId: string;
}

// Fix: Add missing Person and MarriageCompatibilityFormData types for marriage compatibility feature.
export interface Person {
  fullName: string;
dobDay: string;
  dobMonth: string;
  dobYear: string;
}

export interface MarriageCompatibilityFormData {
  person1: Person;
  person2: Person;
  userFullName: string;
  userWhatsapp?: string;
}