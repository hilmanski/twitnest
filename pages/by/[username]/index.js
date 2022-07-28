import InitPosts from "../../../components/InitPosts"
import { PrismaClient } from '@prisma/client';
import Link from 'next/link'

const prisma = new PrismaClient();

const Profile = ({user}) => {
  return (
    <div>
        Profile:
        {user.username}

        {user.posts.length === 0 ? (
            <InitPosts user={user} />
            ) : (
            <ul>
                {user.posts.map(post => (
                <li key={post.id}>
                     <Link href={`/by/${user.username}/${post.slug}`}>
                        <a>{post.title}</a></Link>
                </li>
                ))}
            </ul>
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
                posts: true,
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