import React from "react";
import { auth } from "../config/firebase";

export default function ChatMessage({ message, onEdit, onDelete }) {
  const isMine = message.uid === auth.currentUser?.uid;
  return (
    <div className={`message ${isMine ? "mine" : ""}`}>
      <div className="message-meta">
        <strong className="message-user">{message.user}</strong>
        {message.toName && !isMine && (
          <small className="message-to">→ {message.toName}</small>
        )}
        {isMine && (
          <span className="message-actions" style={{ marginLeft: "auto", display: "flex", gap: "4px" }}>
            <button
              className="btn btn-ghost"
              style={{ padding: "2px 6px", fontSize: "11px", height: "auto" }}
              onClick={() => onEdit && onEdit()}
              aria-label="Edit message"
            >
              Edit
            </button>
            <button
              className="btn btn-ghost"
              style={{ padding: "2px 6px", fontSize: "11px", height: "auto", color: "var(--danger)" }}
              onClick={() => { if (window.confirm('Delete this message?')) onDelete && onDelete(); }}
              aria-label="Delete message"
            >
              Delete
            </button>
          </span>
        )}
      </div>
      <div className="message-body">
        {message.text}
        {message.editedAt && <span style={{ fontSize: "0.7em", opacity: 0.7, marginLeft: "4px" }}>(edited)</span>}
      </div>
    </div>
  );
}
