import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, auth } from "../config/firebase";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import ChatMessage from "../Components/ChatMessage";
import ChatInput from "../Components/ChatInput";
import { useAuth } from "../hooks/useAuth";

export default function Chat() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { users, setSelectedUser } = useAuth();
  const [selectedUser, setLocalSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesRef = collection(db, "messages");
  const endRef = useRef(null);

  useEffect(() => {
    // find user from users list; if not present we'll still show uid
    const u = users?.find((x) => x.uid === uid) || null;
    setLocalSelectedUser(u ? u : { uid });
    // also update context selectedUser so other UI sees it
    setSelectedUser(u ? u : { uid });
  }, [uid, users, setSelectedUser]);

  useEffect(() => {
    const q = query(messagesRef, orderBy("createdAt"));
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      // filter to messages between current user and uid
      const currentUid = auth.currentUser?.uid;
      const conv = msgs.filter((m) => {
        return (
          (m.uid === currentUid && m.to === uid) ||
          (m.uid === uid && m.to === currentUid)
        );
      });
      setMessages(conv);
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    });
    return () => unsub();
  }, [uid]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const currentUid = auth.currentUser?.uid;
    await addDoc(messagesRef, {
      text,
      user: auth.currentUser?.displayName || auth.currentUser?.email || "User",
      uid: currentUid,
      to: uid,
      toName: selectedUser?.displayName || selectedUser?.email || null,
      createdAt: serverTimestamp(),
    });
  };

  return (
    <div className="chat-panel">
      <header className="chat-header">
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <button className="btn-ghost" onClick={() => navigate(-1)}>&larr;</button>
          <div>
            <div style={{ fontWeight: 700 }}>{selectedUser?.displayName || selectedUser?.email || selectedUser?.uid}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{selectedUser?.email}</div>
          </div>
        </div>
        <div className="header-actions">
          <button className="btn-ghost" onClick={() => navigate('/profile')}>Profile</button>
          <button className="btn-ghost" onClick={() => navigate('/home')}>Home</button>
        </div>
      </header>

      <div className="messages">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={endRef}></div>
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
}
