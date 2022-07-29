import { useSession, signIn, signOut } from "next-auth/react"
import React, { useEffect, useState } from 'react';
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
    const [username, setUsername] = useState('')

    // check if localStograge is defined
    useEffect(() => {
        if(localStorage.getItem('username')) {
            setUsername(localStorage.getItem('username'))
        }
    }
    , [])
    

    return (
        <div style={style.navbar}>
            <div className='grid is-mobile'>
                <Link href='/'>
                    <a> <Logo width="100" /></a>
                </Link>
                <h1 style={style.h1}>TwitNest</h1>
            </div>

            <div>


            {
                (session && username) &&
                <>
                    <Link href={`/by/${username}`}>
                        <a>Profile</a>
                    </Link>
                    &nbsp;
                </>
            }

            {
                session ? (
                    <>
                    <Link href="/setting">
                        <a> Setting </a>
                    </Link>
                    &nbsp;
                    <button onClick={() => signOut()}>Sign out</button>
                    </>
                ) : (
                    <Link href="/">
                        <a className='link'>Make your Blog</a>
                    </Link>
                )
            }
            </div>
        </div>
    )
}