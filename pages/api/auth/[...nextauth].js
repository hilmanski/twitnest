import NextAuth from "next-auth"
import TwitterProvider from "next-auth/providers/twitter";
export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    TwitterProvider({
        clientId: process.env.TWITTER_CONSUMER_KEY,
        clientSecret: process.env.TWITTER_CONSUMER_SECRET
    }),
  ],

  callbacks: {
    async jwt({ token, account = {} }) {
      if (account.provider && !token[account.provider]) {
        token[account.provider] = {}
      }

      if (account.oauth_token) {
        token[account.provider].oauth_token = account.oauth_token
      }

      if (account.oauth_token_secret) {
        token[account.provider].oauth_token_secret = account.oauth_token_secret
      }

      // token.name, .email, .picture, .sub, .iat, .exp

      console.log('result --> ')
      console.log(token)
      return token
    },

    secret: process.env.NEXTAUTH_SECRET,
    // async session({ session, token, user }) {
    //   // Send properties to the client, like an access_token from a provider.
    //   session.accessToken = token.accessToken
    //   return session
    // }
  }
})