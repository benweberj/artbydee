'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function ArtDetails({ params }) {
    const { artId:id } = params

    return (
        <main className='debug'>
            <h1>This artwork is called {id}</h1>
        </main>
    )
}