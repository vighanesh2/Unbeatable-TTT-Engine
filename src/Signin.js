import React, { useState } from 'react';
import './Signin.css';
import logo from './resources/logo.png';
import { auth, provider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from './firebase';

function Signin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false); // State for login success
  const [loginError, setLoginError] = useState(null); // State for login error
  const [characterName, setCharacterName] = useState(""); // State to store character name

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(characterName); // Pass character name to onLogin
      setLoginSuccess(true); // Set login success to true
    } catch (error) {
      console.error(error);
      setLoginError("Login unsuccessful. Please check your email and password."); // Set login error message
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onLogin(characterName); // Pass character name to onLogin
      setLoginSuccess(true); // Set login success to true
    } catch (error) {
      console.error(error);
      setLoginError("Sign up unsuccessful. Please try again."); // Set sign up error message
    }
  };
  
  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      onLogin(characterName); // Pass character name to onLogin
      setLoginSuccess(true); // Set login success to true
    } catch (error) {
      console.error(error);
      setLoginError("Sign in with Google unsuccessful. Please try again."); // Set sign in with Google error message
    }
  };

  return (
    <div className="App">
      <div className='section1'>
        <div className='logodiv'>
          <img src={logo} alt="Logo" />
        </div>
        <h1 className='Title'>XpertO</h1>
      </div>
      <div className='section2'>
        <div className='signin'>
          <label htmlFor="fname">Character Name</label>
          <input type="text" id="characterName" name="characterName" value={characterName} onChange={(e) => setCharacterName(e.target.value)} placeholder="Character Name"/>
          <label htmlFor="email">Email</label>
          <input type="text" id="fname" name="fname" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
          <label htmlFor="password">Password</label>
          <input type="password" id="fname" name="fname" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        </div>
        <button onClick={handleSignIn} className='Title2'>CONTINUE</button>
        <button onClick={handleSignUp} className='Title2'>REGISTER</button>
        <button onClick={handleGoogleSignIn} className='Title2'>Sign in with Google</button>
        {loginError && <p className="error-message"><h2 className="Title2">{loginError}</h2></p>} {/* Display login error message */}
        {loginSuccess && ( // Display continue button only if login success
          <button onClick={onLogin} className='Title2'>Continue</button>
        )}
      </div>
    </div>
  );
}

export default Signin;
