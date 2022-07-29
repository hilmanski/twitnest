import Head from 'next/head'
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css'
import { useSession } from "next-auth/react"
import { signIn, signOut } from "next-auth/react"
import React, { useEffect } from 'react';
import Logo from '../components/Logo';
import Link from 'next/link';


export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession()

  // Redirect when logged In
  // useEffect(() => {
  //   if (status === "authenticated") {
  //     router.push("/status")
  //   }
  // }, [status]);

  return (
    <div className={styles.container}>
      <Head>
        <title>TwitNest - twitter to blog</title>
        <meta name="description" content="Convert your twitter into a blog with just one click. Make thread, edit and more!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      

      <main className="main main-home">
        <div style={{textAlign:'center'}}>
          <Logo width="200" />
        </div>
        <br />
        <h1 className={styles.title}>
          Welcome to <span style={{color: '#1C9AEF'}}> TwitNest! </span>
        </h1>
        <h2 className={styles.subtitle}>Make your blog from twitter with one click </h2>

        <div className={styles.description}>
        { status === "authenticated" ?
          <>
            <Link href='/setting'>
              <a class='button is-small'>Setting</a>
            </Link> &nbsp;
            <button class='button is-small' onClick={() => signOut()}>Sign out</button>
          </>
          :
          <>
            <button className={styles.mainBtn} onClick={() => signIn("twitter", { callbackUrl: '/status'} )}>Sign in with Twitter</button>
          </>
        }
        </div>
      </main>

      <footer className={styles.footer}>
        TwitNest - convert your twitter to blog
      </footer>
    </div>
  )
}
