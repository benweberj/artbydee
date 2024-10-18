// import Image from 'next/image'
'use client'
import Animated from "@/components/Animated"
import Link from 'next/link'

let a = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

export default function Home() {
    return (
        <main>
            <Animated mode={'fromleft'}>
                <h1 style={{ fontSize: 100, marginTop: '30vh', textAlign: 'center' }}>
                    Art Gallery
                </h1>
                <Link href='/gallery'>
                    <button className='center'>Check it out</button>
                </Link>
            </Animated>

            <Animated mode={'fromleft'}>
                <h1 style={{ fontSize: 100, marginTop: '40vh', textAlign: 'center' }}>
                    About Dee
                </h1>
                <Link href='/about'>
                    <button className='center'>Get to know the GOAT</button>
                </Link>
            </Animated>

            <Animated mode={'fromleft'}>
                <h1 style={{ fontSize: 100, marginTop: '40vh', textAlign: 'center' }}>
                    Get in touch
                </h1>
                <Link href='/contact'>
                    <button className='center'> </button>
                </Link>
            </Animated>
            <div style={{ marginTop: '40vh' }} />
            {/* <Image src='/img/breaking.webp' layout='fill' /> */}
        </main>
    )
}
