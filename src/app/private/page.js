import { verifySession } from "../../lib/dal";
import "./globals.css";

export default async function PrivatePage() {
  const currentUser = await verifySession();

  return (
    <div className="container">
      <h1>Private: {currentUser.role}</h1>
      <div className="flex">
        <a href="/">Home</a>
      </div>
    </div>
  );
}
