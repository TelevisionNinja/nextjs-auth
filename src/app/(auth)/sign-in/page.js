import SignInForm from "./signInForm";
import { authRedirect, accessCheck } from "../../../lib/access";
import "./globals.css";

export default async function SignIn() {
  await accessCheck("public");
  await authRedirect();

  return (
    <div className="container">
      <h1>Sign In</h1>
      <SignInForm />
    </div>
  );
}
