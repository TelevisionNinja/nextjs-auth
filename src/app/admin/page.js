import { verifySession } from "../../lib/dal";
import "./globals.css";

export default async function AdminPage() {
  const currentUser = await verifySession("admin");

  return (
    <div className="container">
      <h1>Admin: {currentUser.email}</h1>
      <div className="flex">
        <a href="/">Home</a>
      </div>
    </div>
  );
}
