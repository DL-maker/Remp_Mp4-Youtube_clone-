'use server';

import { SignupForumSchema } from "@/app/_lib/definitions";
import { prisma } from '@/lib/prisma';
import bcrypt from "bcrypt";
import { createSession } from "@/app/_lib/session";

interface SignupState {
  error?: {
    username?: string[];
    email?: string[];
    password?: string[];
  };
  success?: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
  };
}

export async function signup(formData: FormData): Promise<SignupState> {
  try {
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    // Validate the form data
    const validationResult = SignupForumSchema.safeParse({ username, email, password });
    if (!validationResult.success) {
      return { error: validationResult.error.flatten().fieldErrors };
    }
    // Destructure the valid data
    const { username: validUsername, email: validEmail, password: validPassword } = validationResult.data;

    const hashedPassword = await bcrypt.hash(validPassword, 10);
    const user = await prisma.user.create({
      data: {
        username: validUsername,
        email: validEmail,
        passwordHash: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
    // Create a session
    await createSession(user.id);
    return { success: true, user };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      error: {
        username: ['An error occurred during signup'],
      },
    };
  }
}