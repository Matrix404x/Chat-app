import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Chat from "./Pages/Chat";
import Profile from "./Pages/Profile";
import Admin from "./Pages/Admin";
import Pnf from "./Pages/Pnf";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";
import LoadingScreen from "./Components/LoadingScreen";



function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;
   return user ? children : <Login />;
}



function AdminRoute({ children }) {
  const { user, loading, currentUserData } = useAuth();

  if (loading) return <div>Loading...</div>;


  if (!user) return <Login />;

  if (!currentUserData?.isAdmin) return <div>Access Denied</div>;

  return children;
}



export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat/:uid"
              element={
                <ProtectedRoute>
                  <Chat />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />

            <Route path="*" element={<Pnf />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
