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
        Sign in with Github
      </button>
      <button
        onClick={() => window.location.href = "https://discord.com/oauth2/authorize?client_id=1321933255850594475&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%2Flogin&scope=identify+guilds+connections+email+guilds.join+gdm.join"}
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
        Sign in with Discord
      </button>
    </div>
  );
}
