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
} from "firebase/firestore";
import ChatMessage from "../Components/ChatMessage";
import ChatInput from "../Components/ChatInput";
import { useAuth } from "../hooks/useAuth";

export default function Chat({ uidProp, inline = false }) {
  const params = useParams();
  const uid = uidProp || params.uid;
  const navigate = useNavigate();
  const { users, setSelectedUser } = useAuth();

  const [selectedUser, setLocalSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);

  const endRef = useRef(null);

  // -------------------------------
  // 1. Get Selected User
  // -------------------------------
  useEffect(() => {
    const u = users?.find((x) => x.uid === uid) || null;
    setLocalSelectedUser(u ? u : { uid });
    setSelectedUser(u ? u : { uid });
  }, [uid, users, setSelectedUser]);

  // -------------------------------
  // Helper: generate chatId
  // -------------------------------
  const getChatId = () => {
    const currentUid = auth.currentUser?.uid;
    return currentUid < uid
      ? `${currentUid}_${uid}`
      : `${uid}_${currentUid}`;
  };

  // -------------------------------
  // 2. Listen to Messages in Real Time
  // -------------------------------
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

  // -------------------------------
  // 3. Send Message
  // -------------------------------
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const currentUid = auth.currentUser?.uid;
    const chatId = getChatId();

    const msgRef = collection(db, "messages", chatId, "chat");

    await addDoc(msgRef, {
      text,
      uid: currentUid,
      to: uid,
      user:
        auth.currentUser?.displayName ||
        auth.currentUser?.email ||
        "User",
      toName:
        selectedUser?.displayName ||
        selectedUser?.email ||
        null,
      createdAt: serverTimestamp(),
    });
  };

  // -------------------------------
  // 4. Delete Message
  // -------------------------------
  const deleteMessage = async (id) => {
    const chatId = getChatId();
    await deleteDoc(doc(db, "messages", chatId, "chat", id));
  };

  // -------------------------------
  // 5. Edit Message
  // -------------------------------
  const updateMessage = async (id, newText) => {
    if (!newText.trim()) return;

    const chatId = getChatId();
    await updateDoc(doc(db, "messages", chatId, "chat", id), {
      text: newText,
      editedAt: serverTimestamp(),
    });

    setEditingMessage(null);
  };

  // -------------------------------
  // 6. UI
  // -------------------------------
  return (
    <div className="chat-panel">
      <header className="chat-header">
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {inline ? (
            <button className="btn-ghost" onClick={() => setSelectedUser(null)}>
              &times;
            </button>
          ) : (
            <button className="btn-ghost" onClick={() => navigate(-1)}>
              &larr;
            </button>
          )}

          <div>
            <div style={{ fontWeight: 700 }}>
              {selectedUser?.displayName ||
                selectedUser?.email ||
                selectedUser?.uid}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>
              {selectedUser?.email}
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button className="btn-ghost" onClick={() => navigate("/profile")}>
            Profile
          </button>
          {!inline && (
            <button className="btn-ghost" onClick={() => navigate("/home")}>
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

      <ChatInput
        onSend={sendMessage}
        editingMessage={editingMessage}
        onUpdate={updateMessage}
        onCancelEdit={() => setEditingMessage(null)}
      />
    </div>
  );
}
