// src/App.js
import React, { useEffect, useState } from "react";
import "./index.css";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for the web app
// Ensure these environment variables are set in your .env file for the web app
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

function App() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  useEffect(() => {
    const getHashParams = () => {
      const params = {};
      window.location.hash.substring(1).split('&').forEach(param => {
        const [key, value] = param.split('=');
        params[key] = decodeURIComponent(value);
      });
      return params;
    };

    const hashParams = getHashParams();
    const type = hashParams.type;
    const accessToken = hashParams.access_token;
    const refreshToken = hashParams.refresh_token;

    if (type === 'recovery' && accessToken && refreshToken) {
      // This is a password reset flow
      setIsResettingPassword(true);
      // Set the session from the URL hash
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: parseInt(hashParams.expires_in || '3600'), // Default expiry
        token_type: 'bearer',
        user: null // User object will be fetched by Supabase if needed
      }).then(({ error }) => {
        if (error) {
          setMessage(`Error setting session: ${error.message}`);
          setIsResettingPassword(false);
        } else {
          setMessage('Please enter your new password.');
        }
      });
    } else {
      // Default state for successful authentication or other redirects
      setMessage('You can now return to the app.');
    }
  }, []);

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    if (!newPassword) {
      setMessage('Password cannot be empty.');
      return;
    }

    setMessage('Updating password...');
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setMessage(`Error updating password: ${error.message}`);
    } else {
      setMessage('Your password has been updated successfully! You can now return to the app.');
      setNewPassword('');
      setConfirmPassword('');
      setIsResettingPassword(false); // Hide the form after successful reset
    }
  };

  return (
    <div className="container">
      <div className="card">
        <img src={`${process.env.PUBLIC_URL}/icon.png`} alt="VoiceVault Logo" className="logo" />

        {isResettingPassword ? (
          <>
            <h1>Reset Password</h1>
            <p>{message}</p>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ marginBottom: '10px', padding: '8px', width: '80%' }}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ marginBottom: '20px', padding: '8px', width: '80%' }}
            />
            <button onClick={handlePasswordUpdate} style={{ padding: '10px 20px', cursor: 'pointer' }}>
              Update Password
            </button>
          </>
        ) : (
          <>
            <h1>Authentication Successful</h1>
            <p>{message}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;