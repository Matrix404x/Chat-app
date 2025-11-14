import React, { useState, useEffect } from "react";

export default function ChatInput({ onSend, editingMessage, onUpdate, onCancelEdit }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (editingMessage) {
      setText(editingMessage.text || "");
    }
  }, [editingMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    if (editingMessage) {
      onUpdate && onUpdate(editingMessage.id, text);
    } else {
      onSend(text);
    }
    setText("");
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        className="chat-input-field"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={editingMessage ? "Edit message..." : "Type a message..."}
        aria-label="Message"
      />
      <div style={{ display: "flex", gap: 8 }}>
        {editingMessage ? (
          <>
            <button className="btn-send" type="submit">Update</button>
            <button type="button" className="btn-secondary" onClick={() => { setText(""); onCancelEdit && onCancelEdit(); }}>Cancel</button>
          </>
        ) : (
          <button className="btn-send" type="submit">Send</button>
        )}
      </div>
    </form>
  );
}
