import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link'
import Head from 'next/head'
import Navbar from '../../../components/Navbar';

const prisma = new PrismaClient();

const Profile = ({user}) => {
  return (
    <div>
    <Head>
        <title>Micro Blog by {user.username}</title>
        <meta property="og:title" content={`Micro Blog by ${user.username}`} key="title" />
        <meta name="description" content={`This is a Micro Blog by ${user.username} from twitter`} />
    </Head>
    <div className='main'>
        <Navbar />
        
        <div className='grid jc-start'>
            <Image
                className="avatar"
                src={`${user.profile_image_url.replace('normal', '400x400')}`}
                alt={`Avatar ${user.username}`}
                width={100}
                height={100}
                />
                &nbsp;&nbsp;

            <div>
            <p className='marginless'> @{user.username} </p>
            <p className='marginless'> {user.fullname}&apos;s Blog </p>
            <p className='marginless'> {user.bio} </p>
            </div>
        </div>

        <div className='mt-20'>
            <Link href={`https://twitter.com/${user.username}`}>
                <a target="_blank" className='link'>/Follow @{user.username} </a>
            </Link>
            {
                user.url && (
                    <Link href={user.url}>
                        <a target="_blank" className='link'>/Visit Website </a>
                    </Link>
                )
            }
        </div>

        {user.posts.length === 0 ? (
            <p>No posts yet.</p>
            ) : (
            <div className='mt-50'>
                <p>📋 Blog List</p>
                <ul>
                    {user.posts.map(post => (
                    <li className='link mt-5' key={post.id}>
                        <Link href={`/by/${user.username}/${post.slug}`}>
                            <a>{post.title}</a></Link>
                    </li>
                    ))}
                </ul>
             </div>   
        )}
    </div>
    </div>
    )
}

export async function getServerSideProps({params}) {
    const { username } = params;

    let user = null
    try {
        user = await prisma.user.findUnique({
            where: {
                username: username
            },
            include: {
                posts: {
                    where: {
                        'deleted_at': null    
                    },
                    orderBy: {
                        created_at: 'desc',
                    }
                },
            },
        });
    }
    catch(e) {
        console.log(e)
    }

    if(!user) {
        return {
            notFound: true
          }
    }

    return {
        props: {
            user: JSON.parse(JSON.stringify(user)) 
        }
    }
  }

export default Profile