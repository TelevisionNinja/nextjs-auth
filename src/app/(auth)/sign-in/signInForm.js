"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "../../../lib/actions";
import { SigninFormSchemaClientSide } from "../../../lib/definitions";
import { passwordHash } from "../clientSide";
import "./globals.css";

export default function SignInForm() {
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const validation = SigninFormSchemaClientSide.safeParse({
      email: email,
      password: password
    });
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }

    const hash = await passwordHash(password, email);

    const errorMsg = await signIn({
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

      <div className="flex justify-end gap-4">
        <Link href="/sign-up" className="button outline">
          Sign Up
        </Link>
        <button type="submit" className="button">Sign In</button>
      </div>
    </form>
  );
}
