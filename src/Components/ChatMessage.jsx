import React from "react";
import { auth } from "../config/firebase";

export default function ChatMessage({ message }) {
  const isMine = message.uid === auth.currentUser?.uid;
  return (
    <div className={`message ${isMine ? "mine" : "other"}`}>
      <div className="message-meta">
        <strong className="message-user">{message.user}</strong>
        {message.toName ? (
          <small className="message-to">→ {message.toName}</small>
        ) : null}
      </div>
      <div className="message-body">{message.text}</div>
    </div>
  );
}
