import { getToken } from "next-auth/jwt"
import { initTwitterClient } from "./config"
import { PrismaClient, Prisma } from '@prisma/client';
import { makeTitle } from "../../../utils/helper"
import slug from 'slug'

const prisma = new PrismaClient();

export default async (req, res) => {
    const token = await getToken({ 
        req, 
        secret: process.env.NEXTAUTH_SECRET
    })

    const client = initTwitterClient(token)
    const owner_id = token.sub

    client.get("statuses/user_timeline", {
            trim_user: true,
            include_rts: false,
            count: 50,
            tweet_mode: 'extended'
        })
        .then(results => {
            let filteredTweets = []
            results.forEach(result => {
                // Ignore quote other tweet
                if(result.is_quote_status)
                    return
            
                // Ignore replies to other people
                if(result.in_reply_to_status_id_str
                    && result.in_reply_to_user_id_str !== owner_id)
                    return
            
                // Ignore a mention
                if(result.full_text.startsWith("@"))
                    return
            
                filteredTweets.push(result)
            });
            
            //  const maxId = results[results.length - 1].id
            console.log('filteredTweets')
            console.log('Length ' + results.length)

            // TODO
            // 1. Separate tweets and threads
            const posts = _generatePosts(filteredTweets)
            // 2. Bulk Insert via Prisma
            
            // 3. TODO MUCH LATER. 
            //        CAN YOU DO THE GENERATEPOSTS LOGIC DIRECLTY ON FIRST LOOP?
            //         to save time

            return res.status(200).json({
                success: true,
                posts: posts
            })
        })
        .catch(error => {
            console.error("Request error", error);
            res.status(500).json({ error: "Error initalizing first posts", success:false });
        })

}

function _generatePosts(filteredTweets) {
    let posts = []
    let threadContainer = []

    filteredTweets.forEach(tweet => {

        console.log(' inspect tweet type ')
        console.log(tweet)
        console.log(' ------------ ')

        let media = null
        if(tweet.extended_entities) {
            media = tweet.extended_entities?.media
        }

        // If current tweet has children
        let subTweet = threadContainer[String(tweet.id)]
        if(subTweet != undefined) {
            subTweet.full_text = tweet.full_text + '\n' + subTweet.full_text  
            
            // add if media exists
            // it's not perfect, since media not sure where to attach.
            //      media could be multiple images or videos. SO for latter
            if(tweet.extended_entities) {
                if(subTweet.extended_entities.media){
                    subTweet.extended_entities.media.push(...tweet.extended_entities.media)
                }else{
                    subTweet['extended_entities']['media'] = tweet.extended_entities.media
                }
            }
        }
        // To Test: what about2nd level

        // If part of thread -> Insert to temporary container
        if(tweet.in_reply_to_status_id) {
            const parent_id = String(tweet.in_reply_to_status_id)

            if(subTweet) {
                threadContainer[parent_id] = subTweet    
            } else {
               threadContainer[parent_id] = tweet
            }

            return
        }

        // If previously has subtweet and now a main thread
        let last_tweet_id = String(tweet.id)
        let last_tweet_id_str = tweet.id_str
        let updated_at = tweet.created_at

        if(!tweet.in_reply_to_status_id && subTweet) {
            tweet.full_text = subTweet.full_text
            tweet.media = subTweet.media

            last_tweet_id = String(subTweet.id)
            last_tweet_id_str = subTweet.id_str
            updated_at = subTweet.created_at
        }


        const _title = makeTitle(tweet.full_text)

        posts.push({
            'title': _title,
            'slug': slug(_title) + '-' + Date.now(),
            'body': tweet.full_text,
            'tweet_id': String(tweet.id),
            'tweet_id_str': tweet.id_str,
            'last_tweet_id': last_tweet_id,
            'last_tweet_id_str': last_tweet_id_str,
            'published': true,
            'created_at': tweet.created_at,
            'updated_at': updated_at,
            'authorId': tweet.user.id,
            'media': media
        })
    })

    return posts
}