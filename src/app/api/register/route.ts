import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET!;

const signupSchema = z.object({
  email: z.string().email("Invalid Email Format"),
  username: z.string().min(1, "Username cannot be empty"),
  password: z.string().min(1, "Password cannot be empty"),
  role: z.enum(["ADMIN", "GUARD", "RECEPTIONIST"], {
    errorMap: () => ({ message: "Invalid role" }),
  }),
  mobileNumber: z.string().min(1, "Mobile number cannot be empty"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validationResult = signupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error.errors[0].message,
        },
        {
          status: 400,
        }
      );
    }

    const { email, username, password, role, mobileNumber } =
      validationResult.data;

    const existingUser = await prisma.account.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.account.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role: role || "ADMIN",
        mobileNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, user: newUser , statusCode : 200 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { success: false, message: "Error creating user" },
      { status: 500 }
    );
  }
}
