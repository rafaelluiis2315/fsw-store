import { prismaClient } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = (await req.json()) as {
            name: string;
            email: string;
            password: string;
        };

        if (await verifyEmailExists(email)) {
            return NextResponse.json(
                {
                    field: "email",
                    message: "E-mail já existe. Por favor, use outro e-mail.",
                },
                { status: 400 }
            );
        }
        const hashed_password = await hash(password, 12);

        const user = await prismaClient.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                password: hashed_password,
            },
        });

        return NextResponse.json({
            user: {
                name: user.name,
                email: user.email,
            },
        });
    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            {
                field: "root",
                message: "Erro ao criar usuário. Por favor, tente novamente.",
            },
            { status: 500 }
        );
    }
}

async function verifyEmailExists(email: string) {
    const user = await prismaClient.user.findUnique({
        where: {
            email,
        },
    });

    return !!user;
}
