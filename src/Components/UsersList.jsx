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
                {/* <div className="meta">{u.email}</div> */}
              </div>
            </li>
          ))}
      </ul>

      <div className="sidebar-footer">
        {/* Personal messaging only - no public chat */}
      </div>
    </aside>
  );
}
