import React, { useState, useEffect, useRef } from "react";

export default function ChatInput({
  onSend,
  onTyping,     // ← NEW
  editingMessage,
  onUpdate,
  onCancelEdit
}) {
  const [text, setText] = useState("");
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.text || "");
    }
  }, [editingMessage]);

  // ---- Handle Typing ----
  const handleTyping = (value) => {
    setText(value);

    // Notify parent (Chat.jsx) that user started typing
    onTyping(true);

    // Clear old timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 1 second of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      onTyping(false);
    }, 1000);
  };

  // ---- Handle Send ----
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    if (editingMessage) {
      onUpdate && onUpdate(editingMessage.id, text);
    } else {
      onSend(text);
    }

    // Reset text
    setText("");

    // Stop typing after sending
    onTyping(false);
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        className="input-field"
        value={text}
        onChange={(e) => handleTyping(e.target.value)}
        placeholder={editingMessage ? "Edit message..." : "Type a message..."}
        aria-label="Message"
        style={{ flex: 1 }}
      />

      <div style={{ display: "flex", gap: 8 }}>
        {editingMessage ? (
          <>
            <button className="btn btn-primary" type="submit">Update</button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setText("");
                onCancelEdit && onCancelEdit();
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button className="btn btn-primary" type="submit">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            Send
          </button>
        )}
      </div>
    </form>
  );
}
