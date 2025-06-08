import 'server-only';

import { createSession, deleteSession, getSession, getUser } from "./database";
import { userInfoSchema } from "./definitions";
import { cache } from "react";
import { SESSION_EXPIRATION, COOKIE_SESSION_KEY, setCookie, decrypt } from "./cookieManagement";

function deleteCookieAndSession(sessionId, cookies) {
  deleteSession(sessionId);
  cookies.delete(COOKIE_SESSION_KEY);
}

export const getUserFromSession = cache(async cookies => {
  const sessionId = await decrypt(cookies.get(COOKIE_SESSION_KEY)?.value);

  if (sessionId == null) {
    return null;
  }

  let result = getSession(sessionId.sessionId, SESSION_EXPIRATION);

  if (!result) {
    // deleteCookieAndSession(sessionId.sessionId, cookies); // could be an expired cookie
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

// export async function updateUserSession(cookies) {
//   const sessionId = await decrypt(cookies.get(COOKIE_SESSION_KEY)?.value)
//   if (sessionId == null) {
//     return;
//   }

//   const sessionObject = updateSession(sessionId.sessionId, SESSION_EXPIRATION);

//   if (sessionObject) { // update cookie expiration
//     await setCookie(sessionId.sessionId, cookies);
//   }
// }

export async function createUserSession(email, cookies) {
  // create a session in the database and return the session ID
  const sessionId = createSession(email);

  await setCookie(sessionId, cookies);
}

export async function deleteUserSession(cookies) {
  const sessionId = await decrypt(cookies.get(COOKIE_SESSION_KEY)?.value);

  if (sessionId == null) {
    return;
  }

  deleteCookieAndSession(sessionId.sessionId, cookies);
}
