'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

import ThemeToggler from './ThemeToggler'
import Settings from './Settings'
import styles from './header.module.scss'

export default function Header() {
    const [showHeader, setShowHeader] = useState(true)
    const [isTop, setIsTop] = useState(true)
    const path = usePathname()
    const posRef = useRef(0)

    useEffect(() => {
        // TODO: throttle/debounce this
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    function handleScroll() {
        let tolerance = 5
        let lastYPos = posRef.current

        let yPos = window.scrollY
        let goingUp = yPos < lastYPos
        let atTop = yPos <= tolerance

        setShowHeader(goingUp || atTop)
        setIsTop(atTop)
        posRef.current = yPos
    }

    let page = path.length > 1 ? path.split('/').at(-1) : ''

    const classNames = [
        styles.header,
        (isTop ? styles.transparent : ''),
        (showHeader ? '' : styles.hidden)
    ].join(' ')

    return (
        <header className={classNames}>
            <Link href='/'>
                <Image priority src='/img/logo.webp' width={50} height={50} className='logo hov' alt='Dee Weber logo' />
            </Link>
            
            <nav className={styles.nav}>
                <ul>
                    <li><Link className={`hover-underline ${page=='gallery' ? 'bold' : ''}`} href='/gallery'>Artwork</Link></li>
                    <li><Link className={`hover-underline ${page=='about' ? 'bold' : ''}`} href='/about'>About</Link></li>
                    <li><Link className={`hover-underline ${page=='contact' ? 'bold' : ''}`} href='/contact'>Contact</Link></li>
                </ul>
            </nav>

            <Settings />

        </header>
    )
}
