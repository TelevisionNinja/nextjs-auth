import 'server-only';

import { cookies } from 'next/headers';
import { getUserFromSession } from "./session";
import { redirect } from "next/navigation";

/**
 * role = null, allow any signed in user
 * role = string, allow only users with that role
 * isAPI = bool, if using to verify page visits, it will redirect unverified users
 */
export async function verifySession(role = null, isAPI = false) {
    const user = await getUserFromSession(await cookies());

    if (!user) {
        if (!isAPI) {
            redirect('/sign-in');
        }

        return null;
    }

    if (role === null || user.role === role) {
        return user;
    }

    if (!isAPI) {
        redirect('/sign-in');
    }

    return null;
}
