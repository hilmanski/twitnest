import { useSession } from "next-auth/react"
import React, { useState, useEffect } from 'react';

export default function InitPosts({ user }) {
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    console.log('status', status)
      if (status === 'authenticated') {
        console.log('here..')
        const fetchData = async () => {
          console.log('there..')
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
    { status === "authenticated" ?
      <>
        <p>*Only you can see this</p>
        <p>Currently Importing your tweets...</p>
      </>
      :
      <>
        <p>No posts yet.</p>
      </>
    }
    </div>
  )
}