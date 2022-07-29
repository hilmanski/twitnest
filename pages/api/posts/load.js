import { getToken } from "next-auth/jwt"
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req, res) => {
    const token = await getToken({ 
        req, 
        secret: process.env.NEXTAUTH_SECRET
    })
    console.log(token)

    // prisma load user by token.sub
    const user = await prisma.user.findUnique({
        where: {
            twitter_id_str: token.sub
        },
        include: {
            posts: {
                where: {
                    'deleted_at': null    
                },
                orderBy: {
                    created_at: 'desc',
                }
            },
        }
    })

    return res.status(200).json({
        success: true,
        posts: JSON.parse(JSON.stringify(user.posts)) 
    })
}