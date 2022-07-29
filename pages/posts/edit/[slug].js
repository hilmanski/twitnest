import { PrismaClient } from '@prisma/client';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react"
import Navbar from "../../../components/Navbar";
import React, { useState } from 'react';

const prisma = new PrismaClient();

const Post = ({post}) => {
    const router = useRouter();
    const { data: session } = useSession()
    const [onSubmit, setOnSubmit] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()
        setOnSubmit(true)

        if (!session) {
            return router.push('/')
        }
    
        const data = {
          user_email: session.user.email,
          title: event.target.title.value,
          snippet: event.target.snippet.value,
          body: event.target.body.value,
        }
        const JSONdata = JSON.stringify(data)
        const endpoint = '/api/posts/update?id=' + post.id
    
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
        
        setOnSubmit(false)
        return router.push('/setting');
    }

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
                <h2>Edit Post: &apos;{post.title}&apos;</h2>

                <div className='mt-50' style={style.wrapper}>
                    <label style={style.label} htmlFor="title">Title</label>   
                    <input style={style.input} type="text" defaultValue={post.title} id="title" name="title" required />
                </div>

                <div style={style.wrapper}>
                    <label style={style.label} htmlFor="snippet">Snippet (max: 150 chars)</label>   
                    <input style={style.input} type="text" defaultValue={post.snippet} id="snippet" name="snippet" required />
                    *Will be used as meta description
                </div>

                <div style={style.wrapper}>
                    <label style={style.label} htmlFor="body">Body</label>   
                    <textarea  style={style.textarea} id="body" name="body" defaultValue={post.body}></textarea>
                    { 
                        post.body.includes('[twitnest:media]') && (
                            <p>*Text &apos;[twitnest:media]&apos; in body is a placeholder for us
                            to serve your image/video later. Don&apos;t delete it.</p>
                        )
                    }
                </div>

                {
                    onSubmit && <p>Submitting...</p>
                }
                <button disabled={onSubmit} type="submit" className='button mt-20'> Update Post </button>
            </form>
        </div>
    )
}

export async function getServerSideProps({username, params}) {
    const { slug } = params;

    let post = null
    try{
        post = await prisma.post.findUnique({
            where: {
                slug: slug
            },
            include: {
                author: true,
            },
        });
    } catch(e) {
        console.log(' failed get prisma data ')
        console.log(e)
        return {
            notFound: true
          }
    }

    console.log(post)
    
    if(!post){
        return {
            notFound: true
          }
    }

    return {
        props: {
            post: JSON.parse(JSON.stringify(post)) 
        }
    }
  }

export default Post