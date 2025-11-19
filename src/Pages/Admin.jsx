import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { db } from "../config/firebase";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import "./Admin.css";

export default function Admin() {
  const { users, currentUserData } = useAuth();
  const [loading, setLoading] = useState(false);

  
  const toggleAdmin = async (uid, current) => {
    if (uid === currentUserData.uid) {
      alert("You cannot change your own admin status!");
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, "users", uid), {
        isAdmin: !current,
      });
    } catch (err) {
      alert("Error updating admin role: " + err.message);
    }
    setLoading(false);
  };


  const deleteUser = async (uid) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    if (uid === currentUserData.uid) {
      alert("Admins cannot delete themselves.");
      return;
    }

    setLoading(true);
    try {
      await deleteDoc(doc(db, "users", uid));
    } catch (err) {
      alert("Failed to delete user: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <p className="admin-sub">Welcome, {currentUserData?.displayName}</p>
        {/* Logout button at the bottom */}
        <div>
            <button className="btn btn-ghost" onClick={() => window.location.href = '/home'}>
              Logout
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-content">
        <h1>User Management</h1>
        <p>Manage user roles, delete users, and view activity.</p>

        {loading && <div className="loading">Processing...</div>}

        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Last Seen</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u.uid}>
                  <td>
                    <img
                      src={
                        u.photoURL ||
                        `https://ui-avatars.com/api/?name=${u.displayName || u.email}`
                      }
                      alt="profile"
                      className="user-avatar"
                    />
                  </td>

                  <td>{u.displayName || "No Name"}</td>

                  <td>{u.email}</td>

                  <td>
                    <span className={`role-badge ${u.isAdmin ? "admin" : "user"}`}>
                      {u.isAdmin ? "ADMIN" : "USER"}
                    </span>
                  </td>

                  <td>{u.lastSeen?.split("T")[0]}</td>

                  <td>
                    {/* Toggle admin */}
                    <button
                      className={`btn ${u.isAdmin ? "btn-yellow" : "btn-green"}`}
                      onClick={() => toggleAdmin(u.uid, u.isAdmin)}
                    >
                      {u.isAdmin ? "Remove Admin" : "Make Admin"}
                    </button>

                    {/* Delete User */}
                    <button
                      className="btn btn-red"
                      onClick={() => deleteUser(u.uid)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
