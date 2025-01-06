import { NextResponse } from 'next/server';
import prisma from '@/prisma';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export async function POST(request: Request) {
  const { username, email, password, role } = await request.json();

  // Vérifier si le rôle est fourni
  if (!role) {
    return NextResponse.json({ error: "Role is required" }, { status: 400 });
  }

  // Vérifier si le rôle est valide
  if (!Object.values(Role).includes(role)) {
    return NextResponse.json({ error: "Invalid role provided" }, { status: 400 });
  }

  // Hacher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Création de l'utilisateur dans la base de données
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash: hashedPassword,
        role: role as Role, // Assurez-vous que le rôle est valide et casté en Role
      },
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    return NextResponse.json(user);
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
