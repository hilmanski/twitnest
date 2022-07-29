import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getUser(token) {
    return await prisma.user.findUnique({
            where: {
                twitter_id_str: token.sub
            }
        })
}