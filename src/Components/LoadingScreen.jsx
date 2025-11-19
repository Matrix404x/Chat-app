import React from "react";
import "./LoadingScreen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <h2 className="loading-text">Loading...</h2>
    </div>
  );
}
