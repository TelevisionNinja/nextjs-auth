import 'server-only';

import { cookies } from 'next/headers';
import { decrypt, COOKIE_SESSION_KEY } from './cookieManagement';
import { getUser, getSession } from "./database";
import { cache } from "react";
import { redirect } from "next/navigation";

export const verifySession = cache(async (role = null) => {
    const cookie = (await cookies()).get(COOKIE_SESSION_KEY)?.value;
    const cookieInfo = await decrypt(cookie);

    if (!cookieInfo) {
        redirect('/sign-in');
        return null;
    }

    const session = getSession(cookieInfo.sessionId);

    if (!session) {
        redirect('/sign-in');
        return null;
    }

    const user = getUser(session.email);

    if (user.role === role) {
        return user;
    }

    redirect('/sign-in');
    return null;
});
