import React from "react";
import { useAuth } from "../hooks/useAuth";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export default function UsersList() {
  const { users, selectedUser, setSelectedUser } = useAuth();
  const currentUid = auth.currentUser?.uid;
  const navigate = useNavigate();

  if (!users) return null;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h4>People</h4>
        {/* Potentially add a searchbar here later */}
      </div>

      <ul className="users-list">
        {users
          .filter((u) => u.uid !== currentUid)
          .map((u) => (
            <li
              key={u.uid}
              className={`user-item ${selectedUser?.uid === u.uid ? "selected" : ""}`}
              onClick={() => {
                setSelectedUser(u);
                const wide = window.innerWidth >= 800;
                if (!wide) {
                  navigate(`/chat/${u.uid}`);
                }
              }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  setSelectedUser(u);
                  // Navigate if mobile logic needed
                }
              }}
            >
              <div className="avatar" aria-hidden>
                {u.photoURL ? (
                  <img src={u.photoURL} alt={u.displayName || u.email} />
                ) : (
                  <span>{(u.displayName || u.email || "?").charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="user-info">
                <div className="name">{u.displayName || u.email}</div>
                {u.email && <div className="meta">{u.email}</div>}
              </div>

              {/* Optional: Add online status indicator if available in future */}
            </li>
          ))}
      </ul>

      <div className="sidebar-footer">
        {/* Footer content if needed */}
      </div>
    </aside>
  );
}
