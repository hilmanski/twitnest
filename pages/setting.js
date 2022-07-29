import { useSession, getSession } from "next-auth/react"
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";

export default function Setting() {
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState([]);
  const [actionText, setActionText] = useState("");

  // Load posts from the database
  useEffect(() => {
    fetch('/api/posts/load')
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts)
      })
  }, []);

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>
  }

  async function fetchNewTweets() {
    const res = await fetch('/api/twitter/init-tweets')
    const data = await res.json()
    console.log(data)
    // Give better feedback or redirect
  }

  async function handleDelete(event, param){
    event.preventDefault()
    setActionText("Deleting...")
    const res = await fetch('/api/posts/delete?id=' + param +'&user_email=' + session.user.email)
    const data = await res.json()
    
    if(data.success) {
      // remove element from list
      setPosts(posts.filter(post => post.id !== param))
      setActionText("")
    }
  };



  return (
    <div className="main">
      <Navbar />
      <h1 className="marginless">Setting Page</h1>
      <h2 className="marginless">Customize your posts</h2>

      <div className="mt-50">
      <h3 className="marginless">/ Fetch New Tweet</h3>
      <p>If you have new tweets after first init. Fetch it here</p>

      <button onClick={() => fetchNewTweets()}>Fetch New Tweets</button>
      </div>

      <hr />
      <div className="mt-50">
      <h3>/ Edit Posts {actionText} </h3>
      { posts.length > 0 ? ( 
          <div>
            { posts.map(post => (
              <div key={post.id}>
                <p>{post.title}
                  &nbsp;
                  <Link href={`/posts/edit/${post.slug}`}>
                        <a className='button is-small'> 🔧 Edit </a>
                  </Link>

                  &nbsp;
                  <a className='button is-small is-danger' href="#" onClick={event => handleDelete(event, post.id)}>🗑 Delete </a>
                </p>
              </div>
            ))}
          </div>
          ) : (
              <Loading />
          )
          }
      </div>
    </div>
  )
}

