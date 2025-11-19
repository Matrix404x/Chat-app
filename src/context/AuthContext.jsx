import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/firebase";
import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  getDoc,
} from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);              
  const [currentUserData, setCurrentUserData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);               
  const [selectedUser, setSelectedUser] = useState(null);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
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


        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setCurrentUserData({ uid: currentUser.uid, ...snap.data() });
        }
      } else {
        setCurrentUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  
  useEffect(() => {
    const usersRef = collection(db, "users");
    const unsub = onSnapshot(usersRef, (snapshot) => {
      const list = snapshot.docs.map((d) => ({ uid: d.id, ...d.data() }));
      setUsers(list);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUserData,   // contains isAdmin
        loading,
        users,
        selectedUser,
        setSelectedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
