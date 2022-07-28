import { useSession } from "next-auth/react"
import React, { useState, useEffect } from 'react';

export default function InitPosts({ user }) {
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    console.log('status', status)
      if (status === 'authenticated' && session.user.email == user.email) {
        const fetchData = async () => {
          const result = fetch('/api/twitter/init-tweets')
                .then(res => res.json())
                .then(data => {
                  console.log(data)
                  // setPosts(data.posts)
                })
                .catch(err => console.log(err))
        };
    
        fetchData();
    }
  }, [status]);
  
  

  return (
    <div>
    { status === "authenticated" && session.user.email == user.email ?
      <>
        <p>*Only you can see this</p>
        <p>Currently Importing your tweets... Reload few seconds later.</p>
      </>
      :
      <>
        <p>No posts yet.</p>
      </>
    }
    </div>
  )
}