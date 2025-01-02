import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const SECRET_KEY = process.env.JWT_SECRET_KEY || crypto.randomBytes(32).toString('hex'); // Utiliser une clé persistante en prod

export async function createSession(userId: string): Promise<void> {
    try {
      if (!SECRET_KEY) {
        throw new Error("SECRET_KEY is not defined.");
      }
  
      // Générer le token JWT
      const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
      console.log('Generated token:', token);  // Vérifier si le token est généré correctement
  
      const cookieStore = cookies();
      (await cookieStore).set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 3600,
      });
  
      console.log('Session created successfully for user:', userId);
    } catch (error) {
      console.error('Error in createSession:', error);
      throw new Error('Failed to create session');
    }
  }
  