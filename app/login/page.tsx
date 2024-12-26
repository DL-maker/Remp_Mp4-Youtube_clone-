"use client";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1>Sign In</h1>
      <button
        onClick={() => signIn("google")}
        style={{
          margin: "10px",
          padding: "10px 20px",
          border: "none",
          backgroundColor: "#4285F4",
          color: "white",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Sign in with Google
      </button>
      <button
        onClick={() => signIn("github")}
        style={{
          margin: "10px",
          padding: "10px 20px",
          border: "none",
          backgroundColor: "#9146FF",
          color: "white",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Sign in with github
      </button>
    </div>
  );
}
