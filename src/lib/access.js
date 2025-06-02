"use server";

import { cookies } from "next/headers";
import { getUserFromSession, updateUserSession } from "./session";
import { redirect } from "next/navigation";

export async function accessCheck(type) {
    const isAdminRoute = type === "admin";
    const isPublicRoute = type === "public";
    const isPrivateRoute = type === "private";

    const cookieStore = await cookies();

    // await updateUserSession(cookieStore);

    if (isPublicRoute) {
        return;
    }

    // 3. Decrypt the session from the cookie
    const user = await getUserFromSession(cookieStore);

    if (!user) {
        redirect("/sign-in");
        return;
    }

    if (isAdminRoute) {
        if (user.role !== "admin") {
            redirect("/sign-in");
            return;
        }
    }

    return;
}

export async function authRedirect() {
  const fullUser = await getUserFromSession(await cookies());
  if (fullUser) {
    redirect("/");
  }
}
