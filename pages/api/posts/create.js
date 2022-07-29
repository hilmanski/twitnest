import { getToken } from "next-auth/jwt"
import { PrismaClient, Prisma } from '@prisma/client';
import { initTwitterClient } from "../twitter/config";
import { makeTitle } from "../../../utils/helper"
import { getUser } from "../auth/check";
import slug from 'slug'

const prisma = new PrismaClient();

export default async (req, res) => {
    const token = await getToken({ 
        req, 
        secret: process.env.NEXTAUTH_SECRET
    })
    
    const client = initTwitterClient(token)
    const user = await getUser(token)

    try {
        //1. Post Tweet/Thread
        const threadSource = req.body.tweets.map(tweet => tweet.tweet)
        
        tweetThread(threadSource, client)
        .then(async (data) => {
            try{
                const _title = makeTitle(req.body.title)
                const post = await prisma.post.create({
                    data: {
                        'title': _title,
                        'slug': slug(_title) + '-' + Date.now(),
                        'snippet': req.body.snippet,
                        'body': threadSource.join('\n'),
                        'tweet_id': String(data.firstTweet.id),
                        'tweet_id_str': data.firstTweet.id_str,
                        'last_tweet_id': String(data.lastTweet.id),
                        'last_tweet_id_str': data.lastTweet.id_str,
                        'published': true,
                        'created_at': new Date(),
                        'updated_at': new Date(),
                        'authorId': String(user.twitter_id),
                    }
                  })

                  return res.status(200).json({
                      success: true
                  })
            } catch (e) {
                console.log('failed inserting post to prisma')
                console.log(e)

                return res.status(500).json({
                    success: false,
                    error: e
                })
            }
        })
        .catch(console.error);

        // 2. Auto fetch new tweets

    } catch (e) {
        return res.status(400).json({
            success: false,
            error: e
        })
    }

    // prisma update post. Can you check owner via prisma?
    // let post = null
    // try{
    //     post = await prisma.post.update({
    //         where: {
    //             id: parseInt(req.query.id)
    //         },
    //         data: {
    //             title: req.body.title,
    //             snippet: req.body.snippet,
    //             body: req.body.body,
    //         }
    //     })
    // } catch (e) {
    //     console.log(e)
    //     return res.status(500).json({
    //         error: 'Failed create prisma via api/posts/update'
    //     })
    // }

}

async function tweetThread(thread, client) {
    let lastTweet = {
        id: "",
        id_str: ""
    };
    let firstTweet = {
        id: "",
        id_str: ""
    };
    
    for (const status of thread) {
      const tweet = await client.post("statuses/update", {
        status: status,
        in_reply_to_status_id: lastTweet.id_str,
        auto_populate_reply_metadata: true
      }).catch(function(e){
        console.log('failed posting status update')
        console.log(e)
      });

        if (firstTweet.id == "") {
            firstTweet.id = tweet.id;
            firstTweet.id_str = tweet.id_str;
        }
        
      lastTweet.id = tweet.id;
      lastTweet.id_str = tweet.id_str;
    }

    return {
        firstTweet, lastTweet
    };
  }