"use client";

import { useState } from "react";
import Link from "next/link";
import { signUp } from "../../../lib/actions";
import { SignupFormSchemaClientSide } from "../../../lib/definitions";
import { passwordHash } from "../clientSide";
import "./globals.css";

export default function SignUpForm() {
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    const validation = SignupFormSchemaClientSide.safeParse({
      email: email,
      password: password,
      confirmPassword: confirmPassword
    });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const hash = await passwordHash(password, email);

    const errorMsg = await signUp({
      email: email,
      hash: hash
    });
    setError(errorMsg);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <label>Email</label>
        <input type="email" name="email" required />
      </div>

      <div>
        <label>Password</label>
        <input type="password" name="password" required />
      </div>

      <div>
        <label>Confirm Password</label>
        <input type="password" name="confirmPassword" required />
      </div>

      <div className="flex justify-end gap-4">
        <Link href="/sign-in" className="button outline">
          Sign In
        </Link>
        <button type="submit" className="button">Sign Up</button>
      </div>
    </form>
  );
}
