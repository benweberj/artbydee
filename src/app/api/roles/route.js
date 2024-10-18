import { getSession }  from '@auth0/nextjs-auth0/edge'
import { NextResponse } from 'next/server'

export async function GET(req) {
    const session = await getSession(req)

    if (!session || !session.user) {
        return NextResponse.json([], { status: 200 })
    }
    const roles = session.user[process.env.AUTH_DOMAIN_KEY]
    return NextResponse.json(roles, { status: 200 })
    
}