import { getToken } from "next-auth/jwt"
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req, res) => {
    const token = await getToken({ 
        req, 
        secret: process.env.NEXTAUTH_SECRET
    })

    // temporary auth guard. Need stronger way
    if (token.email !== req.body.user_email) {
        return res.status(401).json({
            error: 'Unauthorized'
        })
    }

    // prisma update post. Can you check owner via prisma?
    let post = null
    try{
        post = await prisma.post.update({
            where: {
                id: parseInt(req.query.id)
            },
            data: {
                title: req.body.title,
                snippet: req.body.snippet,
                body: req.body.body,
            }
        })
    } catch (e) {
        console.log(e)
        return res.status(500).json({
            error: 'Failed update prisma via api/posts/update'
        })
    }

    return res.status(200).json({
        success: true,
        post: JSON.parse(JSON.stringify(post)) 
    })
}