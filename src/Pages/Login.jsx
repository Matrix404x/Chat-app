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
      <div className="auth-background">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
      </div>

      <div className="auth-card">
        <div className="auth-left">
          <h1 className="brand">Realtime Chat</h1>
          <p className="tag">Fast, simple and private messaging.</p>
          <div className="social">
            <button className="btn-google" onClick={signInWithGoogle} disabled={loading || mode === "reset"}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 12.24c0-.68-.06-1.37-.18-2.02H12v3.83h5.35c-.23 1.24-.93 2.27-1.98 2.96v2.47h3.2c1.88-1.73 2.96-4.28 2.96-7.24z" fill="#4285F4"/><path d="M12 23c2.7 0 4.97-.9 6.63-2.43l-3.2-2.47c-.89.6-2.03.96-3.43.96-2.64 0-4.87-1.78-5.66-4.18H2.97v2.62C4.66 20.9 8 23 12 23z" fill="#34A853"/><path d="M6.34 13.88A7.01 7.01 0 016 12c0-.66.1-1.29.34-1.88V7.5H2.97A10.98 10.98 0 002 12c0 1.77.42 3.44 1.17 4.96l3.17-3.08z" fill="#FBBC05"/><path d="M12 5.1c1.47 0 2.8.5 3.84 1.48l2.88-2.88C16.97 1.94 14.7 1 12 1 8 1 4.66 3.1 2.97 6.41l3.37 2.61C7.13 6.88 9.36 5.1 12 5.1z" fill="#EA4335"/></svg>
              Sign in with Google
            </button>
          </div>
        </div>

        <div className="auth-right">
          {mode !== "reset" && (
            <div className="auth-toggle">
              <button className={`tab ${mode === "login" ? "active" : ""}`} onClick={() => { setMode("login"); setError(""); setSuccess(""); }}>Login</button>
              <button className={`tab ${mode === "signup" ? "active" : ""}`} onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}>Sign Up</button>
            </div>
          )}

          <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
            {mode === "reset" ? (
              <>
                <div style={{ marginBottom: "16px" }}>
                  <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>Reset Password</h3>
                  <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>Enter your email to receive a password reset link.</p>
                </div>

                <div className="field">
                  <label>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>

                {error && <div className="error">{error}</div>}
                {success && <div className="success-msg">{success}</div>}

                <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                  <button className="btn-primary" onClick={handleResetPassword} disabled={loading} style={{ flex: 1 }}>
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                  <button className="btn-secondary" onClick={() => { setMode("login"); setError(""); setSuccess(""); }} type="button">
                    Back
                  </button>
                </div>
              </>
            ) : (
              <>
                {mode === "signup" && (
                  <div className="field">
                    <label>Full name</label>
                    <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Jane Doe" />
                  </div>
                )}

                <div className="field">
                  <label>Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                </div>

                <div className="field">
                  <label>Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter a secure password" />
                </div>

                {error && <div className="error">{error}</div>}
                {success && <div className="success-msg">{success}</div>}

                <div className="actions">
                  {mode === "login" ? (
                    <button className="btn-primary" onClick={signInWithEmail} disabled={loading}>
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  ) : (
                    <button className="btn-primary" onClick={signUp} disabled={loading}>
                      {loading ? "Creating account..." : "Create account"}
                    </button>
                  )}
                </div>

                {mode === "login" && (
                  <div style={{ textAlign: "center", marginTop: "12px" }}>
                    <button
                      type="button"
                      className="btn-link"
                      onClick={() => { setMode("reset"); setError(""); setSuccess(""); }}
                      style={{ fontSize: "13px" }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <div className="help">
                  <small>By continuing you agree to the terms and privacy.</small>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

