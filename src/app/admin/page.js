import { getUserFromSession } from "../../lib/session";
import { accessCheck } from "../../lib/access";
import { cookies } from "next/headers";
import "./globals.css";

export default async function AdminPage() {
  await accessCheck("admin");
  const currentUser = await getUserFromSession(await cookies());

  return (
    <div className="container">
      <h1>Admin: {currentUser.email}</h1>
      <div className="flex">
        <a href="/">Home</a>
      </div>
    </div>
  );
}
