// src/App.js
import React, { useEffect } from "react";
import "./index.css";

function App() {
   useEffect(() => {
     // This script handles redirects from Supabase authentication flows to your mobile app.

     function getHashParams() {
       const params = {};
       window.location.hash.substring(1).split('&').forEach(param => {
         const [key, value] = param.split('=');
         params[key] = decodeURIComponent(value);
       });
       return params;
     }
     const hashParams = getHashParams();

     // Check for Supabase authentication parameters in the URL hash
     const accessToken = hashParams.access_token;
     const refreshToken = hashParams.refresh_token;
     const type = hashParams.type; // e.g., 'recovery', 'signup'
     const expiresIn = hashParams.expires_in;
     const error = hashParams.error;
     const errorDescription = hashParams.error_description;

     // Construct the deep link URL for your mobile app
     let deepLink = 'voicevault://';

     if (type === 'recovery' && accessToken && refreshToken) {
       // This is a password reset flow
       deepLink += 'reset-password'; // Your ResetPasswordScreen route
       deepLink += `?access_token=${accessToken}`;
       deepLink += `&refresh_token=${refreshToken}`;
       if (expiresIn) deepLink += `&expires_in=${expiresIn}`;
     } else if (error) {
       // Handle errors by redirecting to a login screen with error info
       deepLink += 'login'; // Or a specific error screen
       deepLink += `?error=${error}`;
       if (errorDescription) deepLink += `&error_description=${errorDescription}`;
     } else {
       // For other authentication types (e.g., signup confirmation, magic link)
       // You might want to redirect to a success screen or home screen
       deepLink += 'login'; // Default to login or home if no specific type
       if (accessToken) deepLink += `?access_token=${accessToken}`;
       if (refreshToken) deepLink += `&refresh_token=${refreshToken}`;
     }

     // Attempt to redirect to the deep link
     // Using window.location.replace to prevent back button issues
     window.location.replace(deepLink);

     // Fallback: If the deep link doesn't open the app (e.g., app not installed),
     // you might want to show a message or redirect to an app store link.
     // This part will only execute if the deep link fails to open the app.
     const timer = setTimeout(() => {
       const messageElement = document.getElementById('message');
       if (messageElement) {
         messageElement.innerText = 'If the app did not open, please ensure it is installed.';
       }
       // Or redirect to an app store: window.location.href = 'https://your-app-store-link.com';
       console.log('App did not open, consider showing a fallback message or app store link.');
     }, 1000); // Give the deep link a moment to try and open the app

     return () => clearTimeout(timer); // Cleanup the timer if component unmounts
   }, []); // Empty dependency array ensures this runs only once on mount

   return (
     <div className="container">
       <div className="card">
       <img src={`${process.env.PUBLIC_URL}/icon.png`} alt="VoiceVault Logo" className="logo" />

         <h1>Authentication Successful</h1>
         <p>You can now return to the app.</p>
         <p id="message"></p> {/* Optional: for displaying fallback messages */}
       </div>
     </div>
   );
 }

 export default App;