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
        className="chat-input-field"
        value={text}
        onChange={(e) => handleTyping(e.target.value)}   // ← UPDATED
        placeholder={editingMessage ? "Edit message..." : "Type a message..."}
        aria-label="Message"
      />

      <div style={{ display: "flex", gap: 8 }}>
        {editingMessage ? (
          <>
            <button className="btn-send" type="submit">Update</button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setText("");
                onCancelEdit && onCancelEdit();
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button className="btn-send" type="submit">Send</button>
        )}
      </div>
    </form>
  );
}
