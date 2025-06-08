import { NextResponse } from 'next/server';
import { cookies } from "next/headers";
import { updateCookie } from "./lib/cookieManagement"

export default async function middleware(req) {
    await updateCookie(await cookies());

    return NextResponse.next();
}
    
// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
