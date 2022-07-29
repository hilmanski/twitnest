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

    const style = {
        label: {
            display: 'block',
            marginBottom: '5px',
        },
        wrapper: {
            display: 'block',
            marginBottom: '15px',
        },
        input: {
            display: 'block',
            width: '100%',
            padding: '5px',
            fontSize: '1.2rem'
        },
        textarea: {
            display: 'block',
            width: '100%',
            padding: '5px',
            fontSize: '1.2rem'
        }
    }

    return (
        <div className="main">
            <Navbar />
            <form onSubmit={handleSubmit}>
                <h2 className='marginless'>Create Post</h2>
                <p className='marginless'>Post a Tweet/Thread and Blog on one place</p>

                <div className='mt-50' style={style.wrapper}>
                    <label style={style.label} htmlFor="title">Title</label>   
                    <input style={style.input} type="text" id="title" name="title" required />
                </div>

                <div style={style.wrapper}>
                    <label style={style.label} htmlFor="snippet">Snippet (max: 150 chars)</label>   
                    <input style={style.input} type="text" id="snippet" name="snippet" required />
                    *Will be used as meta description
                </div>

                { tweetList.map((data, index) => {
                  return (
                    <div style={style.wrapper} key={index}>
                        <label style={style.label} htmlFor="tweet">Body/Tweet (max. 280 each)</label>   
                        <textarea  style={style.textarea} 
                                id="tweet" 
                                value={data.tweet} 
                                name="tweet"
                                onChange={e => handleInputChange(e, index)}>
                                </textarea>

                        <div className="btn-box">
                            {tweetList.length !== 1 && 
                                <button className="mr-10" onClick={() => handleRemoveClick(index)}>Remove</button>}
                            {tweetList.length - 1 === index && 
                                <button onClick={handleAddClick}>Add Tweet</button>}
                        </div>
                    </div>
                  )  
                })}
                
                {
                    onSubmit && <p>Submitting...</p>
                }
                <button disabled={onSubmit} type="submit" className='button mt-20'> Create Post and Tweet </button>
            </form>
        </div>
    )
}

export default Post