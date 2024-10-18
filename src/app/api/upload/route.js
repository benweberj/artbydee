import { NextResponse } from 'next/server'
import { ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage'
import { storage } from '@/db/firebase'
import { getSession } from '@auth0/nextjs-auth0/edge'


export const POST = async (req) => {
    let session = await getSession(req)

    if (!session || !session.user) {
        return NextResponse.redirect(new URL('/api/auth/login', req.url))
    }

    if (!session.user[process.env.AUTH_DOMAIN_KEY]?.includes('Admin')) {
        return NextResponse.redirect(new URL('/', req.url))
    }

    try {
        async function upload(imgString, id) {
            const base64String = imgString.split(',')[1]
            const extension = imgString.substring(imgString.indexOf('/')+1, imgString.indexOf(';'))
            const imageRef = ref(storage, `paintings/${id}.${extension}`)

            const snapshot = await uploadString(imageRef, base64String, 'base64')
            const url = await getDownloadURL(snapshot.ref)
            return url
        }

        const { mainPhoto, extraPhotos=[], title } = await req.json()
        const id = title.toLowerCase().replace(/\s+/g, '')

        const mainPhotoUrl = await upload(mainPhoto, id)

        const extraPhotoUrls = []
        for (let i = 0; i < extraPhotos.length; i++) {
            let str = extraPhotos[i]
            let url = await upload(str, `${id}-extra-${i+1}`)
            extraPhotoUrls.push(url)
        }

        console.log('uploaded those bad boys')

        return NextResponse.json({ mainPhotoUrl, extraPhotoUrls, id }, { status: 200 })

    } catch (e) {

        console.error('The shit has fucked up', e)
        return NextResponse.json({}, { status: 500 })

    }
}
