
import Link from 'next/link'

export default function NotFound() {

    return (
        <div className='v80 center col'>
            <h1>Woah broski</h1>
            <h3 className='mym normal'>Looks like I haven&apos;t got around to this page yet. Sit tight</h3>
            <div className='flex center sep-lg'>
                <Link href='/'><button>Home</button></Link>
                {/* <button onClick={() => redirect('/gallery')}>Artwork</button>
                <button onClick={() => redirect('/about')}>About</button>
                <button onClick={() => redirect('/contact')}>Contact</button> */}
            </div>
        </div>
    )
}