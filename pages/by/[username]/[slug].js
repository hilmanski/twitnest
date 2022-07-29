import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import { PrismaClient } from '@prisma/client';
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '../../../components/Navbar';

const prisma = new PrismaClient();

function renderBody(body, media) {
    console.log(' render... ')
    const regex = /\[twitnest:media\]/g;
    const matches = body.match(regex);

    // change \n to <br>
    body = body.replace(/\n/g, "<div style='margin-top:10px;'></div>");

    if (matches) {
        // find all media ids in matches
        console.log(matches)
        media = media.reverse();
        for(let i = 0; i < media.length; i++) {
            body = body.replace(
                matches[i], 
                `<img src="${media[i].media_url_https}" alt="image" />`
                )
        }
    }

    console.log('window ', window)
    window.document.getElementById('post_body').innerHTML = body;
}

const Post = ({post}) => {

    useEffect(() => {
        console.log('render body..')
        renderBody(post.body, post.media)
    }, []);

    return (
        <div>
            <Head>
                <title>{post.title}</title>
                <meta property="og:title" content={post.title} key="title" />
                <meta name="description" content={post.snippet} />
            </Head>
        
        <div className='main'>
            <Navbar />


            <h1>{post.title}</h1>
            <div className='post-content' id="post_body"> {post.body} </div>

            <div className='mt-20'>
                <Image
                    className="avatar"
                    src={`${post.author.profile_image_url.replace('normal', '400x400')}`}
                    alt={`Avatar ${post.author.username}`}
                    width={80}
                    height={80}
                    />
                <p className='marginless'>
                    <Link href={`/by/${post.author.username}`}>
                        <a className='link'> @{post.author.username} </a>
                    </Link>
                </p>
                <p className='marginless'>Posted at: {post.created_at}</p>
            </div>

        </div>

        </div>
    )
}

export async function getServerSideProps({username, params}) {
    const { slug } = params;

    let post = await prisma.post.findUnique({
        where: {
            slug: slug
        },
        include: {
            author: true,
        },
    });

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