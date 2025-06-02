"use client";

import { logOut } from "../../lib/actions";
import "./globals.css";

export function LogOutButton() {
  return (
    <button className="button" onClick={async () => await logOut()}>
      Log Out
    </button>
  );
}
