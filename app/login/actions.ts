'use server';

import { SignupForumSchema } from "@/app/_lib/definitions";
import { prisma } from '@/lib/prisma';
import bcrypt from "bcrypt";
import { createSession } from "@/app/_lib/session";
import { verifySession } from "@/app/_lib/session";

type SignupState = {
  error?: {
    username?: string[];
    email?: string[];
    password?: string[];
  };
  success?: boolean;
  user?: any;
};

export async function signup(prevState: SignupState, formData: FormData): Promise<SignupState> {
  try {
    // 1. Get form data
    const username = formData.get('username') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 2. Validate fields
    const validationResult = SignupForumSchema.safeParse({ username, email, password });
    if (!validationResult.success) {
      return { error: validationResult.error.flatten().fieldErrors };
    }
    const { username: validUsername, email: validEmail, password: validPassword } = validationResult.data;

    // 3. Create user
    const hashedPassword = await bcrypt.hash(validPassword, 10);
    const user = await prisma.user.create({
      data: {
        username: validUsername,
        email: validEmail,
        passwordHash: hashedPassword,
      },
    });

    // 4. Create session and return success
    await createSession(user.id);
    return { 
      success: true,
      user 
    };

  } catch (error: any) {
    // Handle specific errors
    if (error.code === 'P2002') {
      // Prisma unique constraint violation
      return {
        error: {
          username: ['Ce nom d\'utilisateur ou cet email est déjà utilisé'],
          email: ['Ce nom d\'utilisateur ou cet email est déjà utilisé']
        }
      };
    }

    // Generic error
    return {
      error: {
        username: ['Une erreur est survenue lors de l\'inscription']
      }
    };
  }
}

export async function banUser(prevState: any, formData: FormData) {
    // Verify user's session
    const session = await verifySession();
    if (typeof session !== 'object' || !('role' in session)) {
        return { error: 'Invalid session data.' };
    }
    const role = session.role;

    if (role !== 'ADMIN') {
        return { error: 'You do not have permission to ban users.' };
    }

    // Perform action
    return { success: true };
}