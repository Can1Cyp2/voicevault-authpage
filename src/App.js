// src/App.js
import React from "react";
import "./index.css";

function App() {
  return (
    <div className="container">
      <div className="card">
      <img src={`${process.env.PUBLIC_URL}/icon.png`} alt="VoiceVault Logo" className="logo" />

        <h1>Authentication Successful</h1>
        <p>You can now return to the app.</p>
      </div>
    </div>
  );
}

export default App;
