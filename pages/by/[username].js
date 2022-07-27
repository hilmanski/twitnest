import InitPosts from "../../components/InitPosts"
import { PrismaClient } from '@prisma/client';
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
                <li key={post.id}>{post.title}</li>
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

    console.log(user)
    return {
        props: {
            user
        }
    }
  }

export default Profile