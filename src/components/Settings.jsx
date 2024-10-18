'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0/client'
import { useTheme } from '@/context/ThemeProvider'

import ThemeToggler from './ThemeToggler'
import styles from './settings.module.scss'

const defaultUser = {
    given_name: 'John Doe',
    nickname: 'randomperson',
    picture: '/img/user.png',
    default: true,
}


export default function Settings() {
    const [open, setOpen]  = useState(false)
    const [admin, setAdmin] = useState(true)
    const [mode, _] = useTheme()
    const settingsRef = useRef(null)
    const iconRef = useRef(null)
    const { user=defaultUser } = useUser()
    const loggedIn = !user.default
    
    function handleClick(e) {
        if (settingsRef && settingsRef.current && iconRef && iconRef.current) {
            if (iconRef.current.contains(e.target)) {
                // do nothing
            } else if (!settingsRef.current.contains(e.target)) {
                setOpen(false)
            }
        }
    }


    useEffect(() => {
        async function getRoles() {
            const res = await fetch('/api/roles')
            const roles = await res.json()
            setAdmin(roles.includes('Admin'))
        }
        getRoles()
        // console.log(roles)
        // setAdmin(isAdmin)
        // console.log(isAdmin)
        // console.log(user)
    }, [user])

    useEffect(() => {
        
        // async function getEm() {
        //     let session = await getSession()
        //     console.log(session)
        // }
        // getEm()


        window.addEventListener('click', handleClick)
        return () => window.removeEventListener('click', handleClick)
    }, [])

    return (
        <div className={styles.container}>
            {/* <div ref={iconRef} className={`circle-lg bg-complement ${styles.icon}`} onClick={() => setOpen(prev => !prev)}>
            </div> */}
            {loggedIn ? <Image
                ref={iconRef}
                className='circle hov'
                src={user.picture}
                alt={`${user.given_name}&apos;s profile picture`}
                width={40} height={40}
                onClick={() => setOpen(prev => !prev)}
            /> :
                <Image
                    ref={iconRef}
                    className='bw hov'
                    src={'/img/user.png'}
                    alt={'Default profile picture'}
                    width={30} height={30}
                    onClick={() => setOpen(prev => !prev)}
                />
            }

            

            <div ref={settingsRef} className={`${styles.settings} ${open ? '' : styles.closed}`} >
                <h4 className='bold mbl'>{user.given_name || user.nickname}&apos;s Settings</h4>
                
                <div className='split'>
                    <p className='mr-xl'><span style={{ textTransform: 'capitalize' }}>{mode}</span> Mode</p>
                    <ThemeToggler />
                </div>

                {loggedIn && admin && (
                    <div className='split mtm'>
                        <p className='mr-xl'>Dee&apos;s Dashboard</p>
                        
                        <Link href='/admin' onClick={() => setOpen(false)}>
                            <Image src={'/img/dashboard.png'} width={20} height={20} className='bw hov' alt='dashboard-icon' />
                        </Link>
                    </div>
                )}

                

                {loggedIn ? 
                    <div className='split mtm'>
                        <p className='mr-xl'>Log out</p>
                        
                        <Link href='api/auth/logout'>
                            <Image src={'/img/lock.png'} width={20} height={20} className='bw hov' alt='logout icon' />
                        </Link>
                    </div>
                : 
                    <div className='split mtm'>
                        <p className='mr-xl'>Sign in</p>
                        
                        <Link href='api/auth/login'>
                            <Image src={'/img/lock.png'} width={20} height={20} className='bw hov' alt='login icon' />
                        </Link>
                    </div>
                }
            </div>    
        </div>
    )
}