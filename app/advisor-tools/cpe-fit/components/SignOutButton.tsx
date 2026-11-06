"use client";

export default function SignOutButton() {
  async function onClick() {
    try {
      await fetch("/api/advisor-tools/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
    } finally {
      window.location.assign("/advisor-tools/login");
    }
  }

  return (
    <button type="button" className="linkish" onClick={onClick}>
      Sign out
    </button>
  );
}
