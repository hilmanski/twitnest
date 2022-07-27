import { getToken } from "next-auth/jwt"
import { initTwitterClient } from "./config"
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req, res) => {
    const token = await getToken({ 
        req, 
        secret: process.env.NEXTAUTH_SECRET
    })

    console.log(' Token from api search twitter: ')
    console.log(token)

    const client = initTwitterClient(token)

    return client.get("account/verify_credentials")
        .then(async function(results){
            try{
                console.log('trying upsert.. ')
                const upsertUser = await prisma.user.upsert({
                    where: {
                      twitter_id: token.sub
                    },
                    update: {
                        email: token.email,
                        twitter_oauth_token: token.twitter.oauth_token,
                        twitter_oauth_token_secret: token.twitter.oauth_token_secret,
                    },
                    create: {
                        email: token.email,
                        fullname: results.name,
                        username: results.screen_name,
                        twitter_id: String(results.id),
                        twitter_id_str: results.id_str,
                        bio: results.description,
                        url: results.url,
                        profile_image_url: results.profile_image_url_https || '',
                        profile_banner_url: results.profile_banner_url || '',
                        twitter_oauth_token: token.twitter.oauth_token,
                        twitter_oauth_token_secret: token.twitter.oauth_token_secret,
                    },
                  })
                
                console.log('done ')
                console.log(upsertUser)

                return res.status(200).json({
                    user: upsertUser, 
                    success: true
                });
            } catch(e) {
                if (e instanceof Prisma.PrismaClientKnownRequestError) {
                    
                    if (e.code === 'P2002') {
                        // prismate get user by twitter_id
                        const user = await prisma.user.findOne({
                            where: {
                                email: token.email
                            }
                        });


                        return res.status(200).json({
                            success: false,
                            fullMessage: 'User is already exists',
                            codeMessage: 'EXISTS'
                        });
                    }
                }

                console.error("Request error", e);
                res.status(500).json({ error: "Error creating User", success:false });
            }
        }).catch(console.error);
}