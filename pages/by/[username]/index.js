import { PrismaClient } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link'
import Navbar from '../../../components/Navbar';

const prisma = new PrismaClient();

const Profile = ({user}) => {
  return (
    <div className='main'>
        <Navbar />
        
        <div className='grid jc-start'>
            <Image
                className="avatar"
                src={`${user.profile_image_url.replace('normal', '400x400')}`}
                alt={`Avatar ${user.username}`}
                width={200}
                height={200}
                />
                &nbsp;&nbsp;

            <div>
            <p className='marginless'> @{user.username} </p>
            <p className='marginless'> {user.fullname}'s Blog </p>
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
    )
}

export async function getServerSideProps({params}) {
    const { username } = params;

    let user = {}
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

    return {
        props: {
            user: JSON.parse(JSON.stringify(user)) 
        }
    }
  }

export default Profile