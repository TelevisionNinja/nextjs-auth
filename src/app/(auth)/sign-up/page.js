import SignUpForm from "./signUpForm.js";
import { authRedirect, accessCheck } from "../../../lib/access";
import "./globals.css";

export default async function SignUp() {
  await accessCheck("public");
  await authRedirect();

  return (
    <div className="container">
      <h1>Sign Up</h1>
      <SignUpForm />
    </div>
  );
}
