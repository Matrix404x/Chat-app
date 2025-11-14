import React from "react";
import { auth } from "../config/firebase";

export default function ChatMessage({ message, onEdit, onDelete }) {
  const isMine = message.uid === auth.currentUser?.uid;
  return (
    <div className={`message ${isMine ? "mine" : "other"}`}>
      <div className="message-meta">
        <strong className="message-user">{message.user}</strong>
        {message.toName ? (
          <small className="message-to">→ {message.toName}</small>
        ) : null}
        {isMine && (
          <span className="message-actions">
            <button className="btn-link" onClick={() => onEdit && onEdit()} aria-label="Edit message">Edit</button>
            <button className="btn-link danger" onClick={() => { if (window.confirm('Delete this message?')) onDelete && onDelete(); }} aria-label="Delete message">Delete</button>
          </span>
        )}
      </div>
      <div className="message-body">{message.text}{message.editedAt ? <span className="edited-tag"> (edited)</span> : null}</div>
    </div>
  );
}
