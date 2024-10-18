import { getSession } from "@auth0/nextjs-auth0/edge"
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/db/firebase'
import { NextResponse } from 'next/server'


export async function POST(req) {
    let session = await getSession(req)

    if (!session || !session.user) {
        return NextResponse.redirect(new URL('/api/auth/login', req.url))
    }

    if (!session.user[process.env.AUTH_DOMAIN_KEY]?.includes('Admin')) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    try {
        const painting = await req.json()
        console.log('heres what im finna post:', painting)
        const paintingRef = doc(db, 'paintings', painting.id)
        await setDoc(paintingRef, painting)
        return NextResponse.json(painting, { status: 200 })

    } catch (e) {
        console.log('sorry man shit fugged up', e)
        return NextResponse.json({ 'something': 'went wrong' }, { status: 500 })
    }

}