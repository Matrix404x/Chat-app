import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { doc, setDoc, collection, onSnapshot } from "firebase/firestore";

// 👇 Export the context itself so other files can use it
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      // When a user signs in, upsert their public profile into `users` collection
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          await setDoc(
            userRef,
            {
              uid: currentUser.uid,
              displayName: currentUser.displayName || null,
              email: currentUser.email || null,
              photoURL: currentUser.photoURL || null,
              lastSeen: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (err) {
          console.error("Failed to upsert user to Firestore:", err.message);
          // Don't block auth flow if Firestore fails; still allow user to proceed
        }
      }
    });
    return unsubscribe;
  }, []);

  // subscribe to users collection so UI can show available users
  useEffect(() => {
    const usersRef = collection(db, "users");
    const unsub = onSnapshot(usersRef, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(list);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, users, selectedUser, setSelectedUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
