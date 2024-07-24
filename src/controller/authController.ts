import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/hashPassword';

const prisma = new PrismaClient();

export const registerUser = async (req: Request, res: Response) => {
  const {  email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: email }
    });

    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.create({
      data: {
       
        email: email,
        password: hashedPassword
      }
    });

    res.send('User registered successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
};
