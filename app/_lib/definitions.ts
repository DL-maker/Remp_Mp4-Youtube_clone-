import { z } from 'zod';

// Schémas de validation pour les formulaires
export const SignupForumSchema = z.object({
  username: z
    .string()
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .max(30, 'Le nom d\'utilisateur ne doit pas dépasser 30 caractères')
    .regex(/^[a-zA-Z0-9_]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, des chiffres et des underscores'),
  email: z
    .string()
    .email('Email invalide')
    .min(5, 'L\'email doit contenir au moins 5 caractères')
    .max(100, 'L\'email ne doit pas dépasser 100 caractères'),
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .max(100, 'Le mot de passe ne doit pas dépasser 100 caractères')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/,
      'Le mot de passe doit contenir au moins une lettre minuscule, une lettre majuscule et un chiffre'
    ),
});

// Types basés sur les schémas
export type SignupFormData = z.infer<typeof SignupForumSchema>;

// Types pour les sessions
export interface Session {
  userId: string;
  role: UserRole;
}

// Types pour les rôles utilisateur
export type UserRole = 'USER' | 'ADMIN';

// Types pour les réponses d'API
export interface ApiResponse<T> {
  data?: T;
  error?: {
    message: string;
    fields?: Record<string, string[]>;
  };
}

// Types pour les utilisateurs
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

// Types pour les vidéos
export interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  publishedAt: Date;
  userId: string;
}

// Types pour les interactions
export interface LikeDislike {
  id: string;
  isLike: boolean;
  createdAt: Date;
  userId: string;
  videoId: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  videoId: string;
}

export interface Subscription {
  id: string;
  subscriberId: string;
  subscribedToId: string;
  createdAt: Date;
}