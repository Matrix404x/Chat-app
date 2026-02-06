import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../config/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  doc,
  setDoc
} from "firebase/firestore";
import ChatMessage from "../Components/ChatMessage";
import ChatInput from "../Components/ChatInput";
import { useAuth } from "../hooks/useAuth";
import "./Chat.css";

export default function Chat({ uidProp, inline = false }) {
  const params = useParams();
  const uid = uidProp || params.uid;
  const navigate = useNavigate();
  const { users, setSelectedUser } = useAuth();

  const [selectedUser, setLocalSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const endRef = useRef(null);

  // Generate chatId
  const getChatId = () => {
    const currentUid = auth.currentUser?.uid;
    return currentUid < uid ? `${currentUid}_${uid}` : `${uid}_${currentUid}`;
  };

  // Load selected user
  useEffect(() => {
    const u = users?.find((x) => x.uid === uid) || { uid };
    setLocalSelectedUser(u);
    setSelectedUser(u);
  }, [uid, users, setSelectedUser]);

  // Listen for all messages in this chat
  useEffect(() => {
    if (!auth.currentUser) return;

    const chatId = getChatId();
    const msgRef = collection(db, "messages", chatId, "chat");
    const q = query(msgRef, orderBy("createdAt"));

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    return () => unsub();
  }, [uid]);

  // Listen for typing indicator
  useEffect(() => {
    const chatId = getChatId();
    const typingRef = doc(db, "typing", chatId);

    const unsub = onSnapshot(typingRef, (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();

      // Show typing only for the OTHER user
      if (data[uid] === true) setIsTyping(true);
      else setIsTyping(false);
    });

    return () => unsub();
  }, [uid]);

  // Send message
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const currentUid = auth.currentUser?.uid;
    const chatId = getChatId();
    const msgRef = collection(db, "messages", chatId, "chat");

    await addDoc(msgRef, {
      text,
      uid: currentUid,
      to: uid,
      user: auth.currentUser?.displayName || auth.currentUser?.email || "User",
      toName: selectedUser?.displayName || selectedUser?.email || null,
      createdAt: serverTimestamp(),
    });

    // Stop typing after sending a message
    await setDoc(doc(db, "typing", chatId), {
      [currentUid]: false,
    }, { merge: true });
  };

  // Handle typing from ChatInput
  const handleTyping = async (typingState) => {
    const chatId = getChatId();
    const currentUid = auth.currentUser.uid;

    await setDoc(
      doc(db, "typing", chatId),
      { [currentUid]: typingState },
      { merge: true }
    );
  };

  // Delete message
  const deleteMessage = async (id) => {
    const chatId = getChatId();
    await deleteDoc(doc(db, "messages", chatId, "chat", id));
  };

  // Edit message
  const updateMessage = async (id, newText) => {
    if (!newText.trim()) return;

    const chatId = getChatId();
    await updateDoc(doc(db, "messages", chatId, "chat", id), {
      text: newText,
      editedAt: serverTimestamp(),
    });

    setEditingMessage(null);
  };

  return (
    <div className="chat-panel">
      <header className="chat-header">
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {inline ? (
            <button className="btn btn-ghost" onClick={() => setSelectedUser(null)} style={{ padding: "4px 8px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>
          ) : (
            <button className="btn btn-ghost" onClick={() => navigate(-1)} style={{ padding: "4px 8px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            </button>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {selectedUser?.photoURL ? (
              <img src={selectedUser.photoURL} alt="" style={{ width: 32, height: 32, borderRadius: 999 }} />
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: 999, background: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", fontWeight: 600 }}>
                {(selectedUser?.displayName || selectedUser?.email || "?").charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontWeight: 600, fontSize: "15px", lineHeight: "1.2" }}>
                {selectedUser?.displayName || selectedUser?.email || selectedUser?.uid}
              </div>
              {/* <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Online</div> */}
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn btn-ghost" onClick={() => navigate("/profile")}>
            Profile
          </button>
          {!inline && (
            <button className="btn btn-ghost" onClick={() => navigate("/home")}>
              Home
            </button>
          )}
        </div>
      </header>

      <div className="messages">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            onEdit={() => setEditingMessage(msg)}
            onDelete={() => deleteMessage(msg.id)}
          />
        ))}
        <div ref={endRef} />
      </div>

      {/* TYPING INDICATOR */}
      {isTyping && (
        <div style={{ padding: "0 24px 8px", fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
          {selectedUser?.displayName || "User"} is typing...
        </div>
      )}

      <ChatInput
        onSend={sendMessage}
        onTyping={handleTyping}
        editingMessage={editingMessage}
        onUpdate={updateMessage}
        onCancelEdit={() => setEditingMessage(null)}
      />
    </div>
  );
}
