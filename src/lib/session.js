import 'server-only'

import { SignJWT, jwtVerify } from 'jose'
import { createSession, deleteSession, updateSession, getSession, getUser } from "./database"
import { userInfoSchema } from "./definitions"
import { cache } from "react"

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + SESSION_EXPIRATION))
    .sign(encodedKey)
}

async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return null;
  }
}

const SESSION_EXPIRATION = 30 * 60 * 1000 // 30 mins
const COOKIE_SESSION_KEY = "session"

export const getUserFromSession = cache(async cookies => {
  const sessionId = await decrypt(cookies.get(COOKIE_SESSION_KEY)?.value);

  if (sessionId == null) {
    return null;
  }

  let result = getSession(sessionId.sessionId);

  if (!result) {
    return null;
  }

  result = getUser(result.email);

  if (!result) {
    return null;
  }

  const { success, data } = userInfoSchema.safeParse(result); // filter out data
  if (!success) {
    return null;
  }

  return data;
});

export async function updateUserSession(cookies) {
  const sessionId = await decrypt(cookies.get(COOKIE_SESSION_KEY)?.value)
  if (sessionId == null) {
    return;
  }

  const sessionObject = updateSession(sessionId.sessionId, SESSION_EXPIRATION);

  if (sessionObject) { // update cookie expiration
    await setCookie(sessionId.sessionId, cookies);
  }
}

export async function createUserSession(email, cookies) {
  // 1. Create a session in the database and return the session ID
  const sessionId = createSession(email);

  await setCookie(sessionId, cookies);
}

export async function deleteUserSession(cookies) {
  const sessionId = await decrypt(cookies.get(COOKIE_SESSION_KEY)?.value);

  if (sessionId == null) {
    return;
  }

  deleteSession(sessionId.sessionId);
  cookies.delete(COOKIE_SESSION_KEY);
}

async function setCookie(sessionId, cookies) {
  const expiresAt = new Date(Date.now() + SESSION_EXPIRATION);

  // 2. Encrypt the session ID
  const session = await encrypt({ sessionId });
 
  // 3. Store the session in cookies for optimistic auth checks
  cookies.set(COOKIE_SESSION_KEY, session, {
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    expires: expiresAt,
    path: '/',
  });
}
