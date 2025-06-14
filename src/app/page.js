import { LogOutButton } from "./(auth)/logOut";
import { getUserFromSession } from "../lib/session";
import { cookies } from "next/headers";
import { accessCheck } from "../lib/access";

export default async function HomePage() {
  await accessCheck("public"); // also updates the session
  const fullUser = await getUserFromSession(await cookies());

  return (
    <main className="container">
      {fullUser == null ? (
        <div className="button-group">
          <a href="/sign-in" className="button">Sign In</a>
          <a href="/sign-up" className="button">Sign Up</a>
        </div>
      ) : (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">User: {fullUser.email}</h2>
            <p className="card-description">Role: {fullUser.role}</p>
          </div>
          <div className="card-footer">
            <a href="/private" className="button outline">Private Page</a>
            {fullUser.role === "admin" && (
              <a href="/admin" className="button outline">Admin Page</a>
            )}
            <LogOutButton />
          </div>
        </div>
      )}
    </main>
  );
}
