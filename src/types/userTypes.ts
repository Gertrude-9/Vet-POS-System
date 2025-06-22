// src/types/userTypes.ts

export type UserRole = 'admin' | 'cashier' | 'inventory';

export interface UserData {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  createdAt: string | Date;
  lastLogin?: string | Date;
  // Add any other fields your user model has
}

export interface CreateUserData {
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  password: string;
  status?: 'Active' | 'Inactive'; // Optional with default
}

export interface UpdateUserData {
  _id: string;
  username?: string;
  email?: string;
  fullName?: string;
  role?: UserRole;
  status?: 'Active' | 'Inactive';
  // Don't include password here unless you have a separate password update endpoint
}