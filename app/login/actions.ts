'use server';
// import { NextResponse } from 'next/server';
import { SignupForumSchema } from "@/app/_lib/definitions";
import bcrypt from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { createSession } from "@/app/_lib/session";
import { Role } from '@prisma/client';

interface SignupSuccess {
  success: true;
  redirectUrl: string;
}

interface SignupError {
  success: false;
  error: {
    username?: string[];
    email?: string[];
  };
}
type SignupResult = SignupSuccess | SignupError;

export async function signup(formData: FormData, baseUrl: string): Promise<SignupResult> {
  try {
    // Récupération des données du formulaire
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Validation des données
    const validationResult = SignupForumSchema.safeParse({ username, email, password });
    if (!validationResult.success) {
      console.log('Validation failed:', validationResult.error.flatten());
      return {
        success: false,
        error: validationResult.error.flatten().fieldErrors,
      };
    }

    // Vérification si l'utilisateur existe déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (existingUser) {
      console.log('User exists:', existingUser);
      return {
        success: false,
        error: {
          username: existingUser.username === username ? ['Username already taken'] : undefined,
          email: existingUser.email === email ? ['Email already taken'] : undefined,
        },
      };
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur dans la base de données
    const user = await prisma.user.create({
      data: { username, email, passwordHash: hashedPassword, role: Role.USER, id: undefined }, // Use the enum value and let Prisma auto-generate the ID
      select: { id: true, username: true, email: true },
    });

    console.log('User created:', user);

    // Tentative de création de la session
    try {
      await createSession(user.id.toString());
      console.log('Session created for user:', user.id);
    } catch (sessionError) {
      console.error('Session creation failed:', sessionError);
      return {
        success: false,
        error: {
          username: ['Failed to create session. Please try again.'],
        },
      };
    }

    // Redirection vers le profil après la création
    const absoluteUrl = `${baseUrl}/profile`;
    return {
      success: true,
      redirectUrl: absoluteUrl,
    };

  } catch (error) {
    console.error('Signup error:', error instanceof Error ? { message: error.message } : error || {});
    return {
      success: false,
      error: { username: ['An unexpected error occurred. Please try again.'] },
    };
  }
}
