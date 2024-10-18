
import Link from 'next/link'

export default function AdminDashboard() {

    return (
        <main className='center'>

            <div className='flex wrap sep-sm'>
                <Link href='/admin/addpainting'>
                    <div className='card hov'>
                        <h3>Add a painting</h3>
                    </div>
                </Link>

                <Link href='/admin/addpainting'>
                    <div className='card'>
                        <h3>Add a painting</h3>
                    </div>
                </Link>
            </div>
        </main>
    )
}