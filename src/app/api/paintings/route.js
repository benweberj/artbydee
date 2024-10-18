import { NextResponse } from "next/server"

import { db } from '@/db/firebase'
import { collection, getDocs } from 'firebase/firestore'

export async function GET() {
    try {
        const snapshot = await getDocs(collection(db, 'paintings'))
        const paintings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))   
        return NextResponse.json(paintings)
    } catch (err) {
        console.log('Error fetching Dee\'s masterpieces')
        return NextResponse.json([{ title: 'Not Found', description: 'unknown', id: 'whisper', materials: 'unknown' }])
    }
}