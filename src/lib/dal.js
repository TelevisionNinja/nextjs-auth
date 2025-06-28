import 'server-only';

import { cookies } from 'next/headers';
import { getUserFromSession } from "./session";
import { redirect } from "next/navigation";

/**
 * role = null, allow any signed in user
 * role = string, allow only users with that role
 */
export async function verifySession(role = null) {
    const user = await getUserFromSession(await cookies());

    if (!user) {
        redirect('/sign-in');
        return null;
    }

    if (role === null || user.role === role) {
        return user;
    }

    redirect('/sign-in');
    return null;
}
