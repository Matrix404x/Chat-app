import React from "react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import UsersList from "../Components/UsersList";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="app-layout">
      <UsersList />

      <div className="chat-panel">
        <header className="chat-header">
          <h2>Realtime Chat</h2>
          <div className="header-actions">
            <button className="btn-ghost" onClick={() => navigate('/profile')}>
              Profile
            </button>
            <button className="btn-ghost" onClick={() => signOut(auth)}>
              Logout
            </button>
          </div>
        </header>

        <div className="messages">
          <div style={{ padding: "20px", textAlign: "center", color: "var(--muted)" }}>
            <p style={{ fontSize: "18px", fontWeight: "600" }}>Select a person to start messaging</p>
            <p style={{ fontSize: "14px" }}>Click on any user in the left sidebar to open a direct chat.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
