import { getUserFromSession } from "../../lib/session";
import { cookies } from "next/headers";
import { accessCheck } from "../../lib/access";
import "./globals.css";

export default async function PrivatePage() {
  await accessCheck("private");
  const currentUser = await getUserFromSession(await cookies());

  return (
    <div className="container">
      <h1>Private: {currentUser.role}</h1>
      <div className="flex">
        <a href="/">Home</a>
      </div>
    </div>
  );
}
