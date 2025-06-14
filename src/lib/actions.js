"use server";

import { createUserSession, deleteUserSession } from "./session";
import { SigninFormSchemaServerSide, SignupFormSchemaServerSide } from "./definitions";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getUser, createUser } from "./database";
import { Buffer } from 'node:buffer';

export async function generateSalt() {
  return crypto.randomBytes(16).toString('hex').normalize();
}

export async function passwordHash(password, salt = "abcdefghijklmnopqrstuvwxyz1234567890", iterations = 210000) {
  const derivedBits = crypto.pbkdf2Sync(password, salt, iterations, 512, 'sha512');
  const hashHex = derivedBits.toString('hex').normalize();

  return hashHex;
}

export async function comparePasswords(hash, dbHash, salt) {
  hash = await passwordHash(hash, salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(dbHash));
}

export async function signIn(unsafeDataObject) {
  const { success, data } = SigninFormSchemaServerSide.safeParse(unsafeDataObject);

  if (!success) return "Unable to log you in";

  const user = getUser(data.email);

  if (!user) {
    return "Unable to log you in";
  }

  const isCorrectPassword = await comparePasswords(data.hash, user.hash, user.salt);

  if (!isCorrectPassword) return "Unable to log you in";

  await createUserSession(user.email, await cookies());
  redirect("/");
}

export async function signUp(unsafeDataObject) {
  const { success, data } = SignupFormSchemaServerSide.safeParse(unsafeDataObject);

  if (!success) return "Unable to create account";

  const existingUser = getUser(data.email);

  if (existingUser) return "Unable to create account";

  try {
    const salt = await generateSalt();
    const hashedPassword = await passwordHash(data.hash, salt);

    createUser(data.email, hashedPassword, salt);
  } catch {
    return "Unable to create account";
  }

  redirect("/");
}

export async function logOut() {
  await deleteUserSession(await cookies());
  redirect("/");
}
