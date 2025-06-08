"use server";

import { cookies } from "next/headers";
import { getUserFromSession } from "./session";
import { redirect } from "next/navigation";

export async function accessCheck(type) {
    const isAdminRoute = type === "admin";
    const isPublicRoute = type === "public";
    const isPrivateRoute = type === "private";

    const cookieStore = await cookies();
    const user = await getUserFromSession(cookieStore);

    if (isPublicRoute) {
        return;
    }

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
