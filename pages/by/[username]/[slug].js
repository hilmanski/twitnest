import { PrismaClient } from '@prisma/client';
import Link from 'next/link'
import Image from 'next/image'


const prisma = new PrismaClient();

const Post = ({post}) => {
    return (
        <div>
            <h1>{post.title}</h1>

            <p>
            {post.body}
            </p>

            <p>
                Created at: {post.created_at}
            </p>

            <div>
                <Link href={`/by/${post.author.username}`}>
                    <a> @{post.author.username}</a>
                </Link>
                <Image
                    src={`${post.author.profile_image_url.replace('normal', '400x400')}`}
                    alt={`Avatar ${post.author.username}`}
                    width={80}
                    height={80}
                    />
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