import { useSession, getSession } from "next-auth/react"
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";

export default function Setting() {
  const router = useRouter();
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState([]);
  const [actionText, setActionText] = useState("");

  // Load posts from the database
  useEffect(() => {
    if(session != null && session != undefined) {
      loadPosts()
    } else {
      router.push('/')
    }
  }, [status]);

  function loadPosts() {
    fetch('/api/posts/load')
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts)
      })
  }

  if (status === "loading") {
    return <p>Loading...</p>
  }

  async function fetchNewTweets() {
    setActionText("Fetching new tweets...")
    const res = await fetch('/api/twitter/init-tweets')
    const data = await res.json()
    loadPosts()
    setActionText("")
  }

  async function handleDelete(event, param){
    event.preventDefault()
    setActionText("Deleting...")
    const res = await fetch('/api/posts/delete?id=' + param)
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
      <h2 className="marginless">Customize your posts - {actionText}</h2>

      <div className="grid">
        <div className="mt-50">
          <h3 className="marginless">/ Write New Post</h3>
          <p>You can create new post and tweet from here</p>

          <Link href='/posts/create'><a className="button">Write New Post+</a></Link>
        </div>

        <div className="mt-50">
          <h3 className="marginless">/ Fetch New Tweet</h3>
          <p>If you have new tweets after first init. Fetch it here</p>

          <button className="button" onClick={() => fetchNewTweets()}>Fetch New Tweets</button>
        </div>
      </div>

      <div className="mt-50">
      <h3>/ Manage Posts  </h3>
      { posts.length > 0 ? ( 
          <div>
            { posts.map(post => (
              <div className='grid' key={post.id}>
                <p>{post.title}</p>
                
                <div>
                  <Link href={`/posts/edit/${post.slug}`}>
                    <a className='button is-small'> 🔧 Edit </a>
                  </Link>

                  &nbsp;
                  <a className='button is-small is-danger' href="#" onClick={event => handleDelete(event, post.id)}>🗑 Delete </a>
                </div>
                
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

