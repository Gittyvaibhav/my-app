import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import getOrCreateDB from './models/server/dbSetup'
import getOrCreateStorage from './models/server/storage.collection'
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    await Promise.all([getOrCreateDB(), getOrCreateStorage()])
    return NextResponse.next()
}

// See "Matching Paths" below to learn more 
// about configuring this middleware to only run on specific paths and not run where matcher is not used.
export const config = {
    // Match all request paths except for the ones starting with /api or /static
    matcher: ['/:path((?!api|static).*)'],
    "/login": { matcher: '/login' },

}