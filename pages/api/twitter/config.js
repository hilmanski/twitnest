import Twitter from 'twitter-lite'

//export function with parameter token
export function initTwitterClient(token) {
    return new Twitter({
        consumer_key: process.env.TWITTER_CONSUMER_KEY,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
        access_token_key: token.twitter.oauth_token,
        access_token_secret: token.twitter.oauth_token_secret,
    });
}