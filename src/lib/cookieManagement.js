import 'server-only';

import { SignJWT, jwtVerify } from 'jose';

export const SESSION_EXPIRATION = 30 * 60 * 1000; // 30 mins
export const COOKIE_SESSION_KEY = "session";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(new Date(Date.now() + SESSION_EXPIRATION))
    .sign(encodedKey);
}

export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload;
  } catch (error) {
    return null;
  }
}

export async function setCookie(sessionId, cookies) {
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

export async function updateCookie(cookies) {
  const sessionId = await decrypt(cookies.get(COOKIE_SESSION_KEY)?.value);

  if (sessionId == null) {
    return;
  }

  await setCookie(sessionId.sessionId, cookies);
}
