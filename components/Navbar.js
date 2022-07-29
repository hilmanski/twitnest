import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
import Logo from "./Logo";

const style = {
    navbar: {
        display: "flex",
        marginBottom: "25px",
        alignItems: "center",
        justifyContent: "space-between"
    },

    h1: {
        fontSize: "1.5rem",
        marginLeft: "10px",
        color: "#1C9AEF"
    }
}

export default function Navbar(){
    const { data: session } = useSession()

    return (
        <div style={style.navbar}>
            <div className='grid is-mobile'>
                <Logo width="100" />
                <h1 style={style.h1}>TwitNest</h1>
            </div>

            {
                session ? (
                    <div>
                    <Link href="/setting">
                        <a> Setting </a>
                    </Link>
                    &nbsp;
                    <button onClick={() => signOut()}>Sign out</button>
                    </div>
                ) : (
                    <Link href="/">
                        <a className='link'>Make your Blog</a>
                    </Link>
                )
            }
        </div>
    )
}