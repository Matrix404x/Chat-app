import React, { useState } from "react";
import { auth } from "../config/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [mode, setMode] = useState("login"); // 'login', 'signup', or 'reset'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      if (!email || !password) return setError("Please enter email and password.");
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      setError(err.message || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  const signUp = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      if (!email || !password) return setError("Please enter email and password.");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
      navigate("/home");
    } catch (err) {
      setError(err.message || "Sign-up failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      if (!email) return setError("Please enter your email address.");
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Check your inbox.");
      setEmail("");
      setTimeout(() => setMode("login"), 2000);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Realtime Chat</h1>
          <p>
            {mode === "login" && "Welcome back! Please login to your account."}
            {mode === "signup" && "Create an account to get started."}
            {mode === "reset" && "Reset your password."}
          </p>
        </div>

        {error && <div className="error-msg">{error}</div>}
        {success && <div className="status-message success" style={{ marginBottom: '1rem' }}>{success}</div>}

        {mode !== "reset" && (
          <div style={{ marginBottom: "1.5rem" }}>
            <button 
              className="btn btn-secondary" 
              onClick={signInWithGoogle} 
              disabled={loading}
              style={{ width: "100%", justifyContent: "center" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12.24c0-.68-.06-1.37-.18-2.02H12v3.83h5.35c-.23 1.24-.93 2.27-1.98 2.96v2.47h3.2c1.88-1.73 2.96-4.28 2.96-7.24z" fill="#4285F4"/><path d="M12 23c2.7 0 4.97-.9 6.63-2.43l-3.2-2.47c-.89.6-2.03.96-3.43.96-2.64 0-4.87-1.78-5.66-4.18H2.97v2.62C4.66 20.9 8 23 12 23z" fill="#34A853"/><path d="M6.34 13.88A7.01 7.01 0 016 12c0-.66.1-1.29.34-1.88V7.5H2.97A10.98 10.98 0 002 12c0 1.77.42 3.44 1.17 4.96l3.17-3.08z" fill="#FBBC05"/><path d="M12 5.1c1.47 0 2.8.5 3.84 1.48l2.88-2.88C16.97 1.94 14.7 1 12 1 8 1 4.66 3.1 2.97 6.41l3.37 2.61C7.13 6.88 9.36 5.1 12 5.1z" fill="#EA4335"/></svg>
              Sign in with Google
            </button>
            <div style={{ margin: "1.5rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
              <span style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>or</span>
              <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
            </div>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()}>
          {mode === "signup" && (
            <div className="field">
              <label>Full Name</label>
              <input 
                className="input-field" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
                placeholder="John Doe" 
              />
            </div>
          )}

          <div className="field">
            <label>Email Address</label>
            <input 
              className="input-field" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="you@example.com" 
            />
          </div>

          {mode !== "reset" && (
            <div className="field">
              <label>Password</label>
              <input 
                className="input-field" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
              />
            </div>
          )}

          <div style={{ marginTop: "1.5rem" }}>
            {mode === "login" && (
              <button 
                className="btn btn-primary" 
                style={{ width: "100%" }} 
                onClick={signInWithEmail} 
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            )}
            {mode === "signup" && (
              <button 
                className="btn btn-primary" 
                style={{ width: "100%" }} 
                onClick={signUp} 
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            )}
            {mode === "reset" && (
               <div style={{ display: "flex", gap: "1rem" }}>
                 <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1 }} 
                  onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }} 
                  onClick={handleResetPassword} 
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            )}
          </div>
        </form>

        <div style={{ marginTop: "1.5rem", textAlign: "center", fontSize: "0.875rem" }}>
          {mode === "login" && (
            <>
              <p style={{ marginBottom: "0.5rem" }}>
                <button className="btn-ghost" style={{ padding: 0 }} onClick={() => { setMode("reset"); setError(""); }}>
                  Forgot password?
                </button>
              </p>
              <p style={{ color: "var(--text-muted)" }}>
                Don't have an account?{" "}
                <button 
                  className="btn-ghost" 
                  style={{ padding: 0, color: "var(--primary)", fontWeight: 600 }} 
                  onClick={() => { setMode("signup"); setError(""); }}
                >
                  Sign up
                </button>
              </p>
            </>
          )}
          {mode === "signup" && (
            <p style={{ color: "var(--text-muted)" }}>
              Already have an account?{" "}
              <button 
                className="btn-ghost" 
                style={{ padding: 0, color: "var(--primary)", fontWeight: 600 }} 
                onClick={() => { setMode("login"); setError(""); }}
              >
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

