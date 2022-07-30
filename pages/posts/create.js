import { PrismaClient } from '@prisma/client';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react"
import Navbar from "../../components/Navbar";
import React, { useState } from 'react';

const Post = () => {
    const router = useRouter();
    const { data: session } = useSession()
    const [onSubmit, setOnSubmit] = useState(false)
    const [tweetList, setTweetList] = useState([{ tweet: "" }]);

    const handleSubmit = async (event) => {
        event.preventDefault()
        setOnSubmit(true)

        if (!session) {
            return router.push('/')
        }
    
        const data = {
          title: event.target.title.value,
          snippet: event.target.snippet.value,
          tweets: tweetList
        }
        const JSONdata = JSON.stringify(data)
        const endpoint = '/api/posts/create'
    
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSONdata,
        }
    
        // Send the form data to our forms API on Vercel and get a response.
        const response = await fetch(endpoint, options)
        const result = await response.json()
        // Redirect to that page
        //   router.push('/by/'+ data.user.username);
        setOnSubmit(false)
        return router.push('/setting');
    }

    const handleAddClick = () => {
        setTweetList([...tweetList, { tweet: "" }]);
    };

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...tweetList];
        list[index][name] = value;
        setTweetList(list);
      };
       
    // handle click event of the Remove button
    const handleRemoveClick = index => {
        const list = [...tweetList];
        list.splice(index, 1);
        setTweetList(list);
    };

    return (
        <div className="main">
            <Navbar />
            <form onSubmit={handleSubmit}>
                <h2 className='marginless'>Create Post</h2>
                <p className='marginless'>Post a Tweet/Thread and Blog on one place</p>

                <div className="mt-50 wrapper">
                    <label className="label" htmlFor="title">Title</label>   
                    <input className="input" type="text" id="title" name="title" required />
                </div>

                <div className="wrapper">
                    <label className="label" htmlFor="snippet">Meta Desciption for SEO (max: 150 chars)</label>   
                    <input className="input" type="text" id="snippet" name="snippet" required />
                </div>

                { tweetList.map((data, index) => {
                  return (
                    <div className="wrapper" key={index}>
                        <label className="label" htmlFor="tweet">Body/Tweet (max. 280 each)</label>   
                        <textarea  className="textarea" 
                                id="tweet" 
                                value={data.tweet} 
                                name="tweet"
                                onChange={e => handleInputChange(e, index)}>
                                </textarea>

                        <div className="btn-box">
                            {tweetList.length !== 1 && 
                                <button className="mr-10" onClick={() => handleRemoveClick(index)}>Remove</button>}
                            {tweetList.length - 1 === index && 
                                <button onClick={handleAddClick}>Add more Tweet</button>}
                        </div>
                    </div>
                  )  
                })}
                <span className='input-info'>*Click &ldquo;add more Tweet &rdquo;  above to make a thread</span>
                {
                    onSubmit && <p>Submitting...</p>
                }
                <button disabled={onSubmit} type="submit" className='button mt-20'> Create Post and Tweet </button>
            </form>
        </div>
    )
}

export default Post