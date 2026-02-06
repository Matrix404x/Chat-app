import React from "react";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import UsersList from "../Components/UsersList";
import Chat from "./Chat";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const navigate = useNavigate();
  const { selectedUser } = useAuth();
  const wide = typeof window !== "undefined" && window.innerWidth >= 800;

  return (
    <div className="app-layout">
      <UsersList />

      {selectedUser && wide ? (
        <Chat uidProp={selectedUser.uid} inline={true} />
      ) : (
        <div className="chat-panel">
          <header className="chat-header">
            <h2>Messages</h2>
            <div className="header-actions">
              <button className="btn btn-ghost" onClick={() => navigate('/profile')}>
                Profile
              </button>
              <button className="btn btn-ghost" onClick={() => navigate('/Admin')}>
                Admin
              </button>
              <button className="btn btn-ghost" onClick={() => signOut(auth)}>
                Logout
              </button>
            </div>
          </header>

          <div className="messages" style={{ alignItems: "center", justifyContent: "center", textAlign: "center", opacity: 0.6 }}>
            <div style={{ maxWidth: "300px" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>👋</div>
              <h3 style={{ marginTop: 0, fontWeight: 600, color: "var(--text-main)" }}>Welcome back!</h3>
              <p style={{ color: "var(--text-muted)" }}>Select a person from the sidebar to start chatting.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
