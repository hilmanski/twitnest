import Head from 'next/head'
import Image from 'next/image';
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
              <a className='button is-small'>Setting</a>
            </Link> &nbsp;
            <button className='button is-small' onClick={() => signOut()}>Sign out</button>
          </>
          :
          <>
            <button className={styles.mainBtn} onClick={() => signIn("twitter", { callbackUrl: '/status'} )}>Make Your Blog From Twitter</button>
          </>
        }


        <p className='text-center mt-50'>
          Request any feature? <a className="link" target="_blank" href="https://twitnest.sleekplan.app/"> here </a> 
         / 
         See Twitnest updates <a className="link" target="_blank" href="https://twitnest.sleekplan.app/changelog"> here</a>
        </p>
        </div>
        
        <div className='features'>
          <p className='main-title'>See TweetNest in Action 👇🏼</p>
          

          <p className='featurelist'> 
            <span className='good'> Your Simple Blog in ONE CLICK </span>
            <span className='bad'> Without Twitter's Clutter </span>
          </p>
          <Image src="https://i.ibb.co/KKwQfSc/timeline.png"
            width={700}
            height={450}
          />

      <p className='featurelist'> 
            <span className='bad'> Reading in Twitter is full of distraction </span>
            <span className='good'> Let your reader &ldquo;read&rdquo; </span>
          </p>
          <Image src="https://i.ibb.co/XZgs9vV/thread.png"
            width={700}
            height={700}
          />

        <p className='featurelist'> 
            <span className='bad'> You can&apos;t edit your tweets </span>
            <span className='good'> But you can edit your blog </span>
          </p>
          <Image src="https://i.ibb.co/C8tTJGw/edit.png"
            width={700}
            height={400}
          />

        <p className='featurelist'> 
            <span className='bad'> Writing in Twitter is painful? </span>
            <span className='good'> Create new tweets/thread/post in peace </span>
          </p>
          <Image src="https://i.ibb.co/27cXsKh/createpostandtweet.png"
            width={700}
            height={500}
          />
         </div>

         <div className={styles.description}>
         { status === "authenticated" ?
          <>
            <Link href='/setting'>
              <a className='button is-small'>Setting</a>
            </Link> &nbsp;
            <button className='button is-small' onClick={() => signOut()}>Sign out</button>
          </>
          :
          <>
            <button className={styles.mainBtn} onClick={() => signIn("twitter", { callbackUrl: '/status'} )}>Sign in with Twitter</button>
          </>
        }


        <p className='text-center'>
          Request any feature? <a className="link" target="_blank" href="https://twitnest.sleekplan.app/"> here</a>
        </p>

        <p className='text-center'>
         See Twitnest updates <a className="link" target="_blank" href="https://twitnest.sleekplan.app/changelog"> here</a>
        </p>
        </div>

      </main>

      <footer className={styles.footer}>
        TwitNest - convert your twitter to blog
      </footer>
    </div>
  )
}
