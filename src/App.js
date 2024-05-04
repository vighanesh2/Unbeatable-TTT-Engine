import React, { useState } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"; // Import BrowserRouter
import Signin from './Signin';
import './App.css';
import Tictactoe from './tictactoe';
import CoinToss from './cointoss';
import Home from './Home';
import Twoplayers from './Twoplayersgame'; 

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [playWithAI, setPlayWithAI] = useState(false);
  const [coinTossDone, setCoinTossDone] = useState(false);
  const [showHome, setShowHome] = useState(true); 
  const [showTwoplayers, setShowTwoplayers] = useState(false); // State to control visibility of Twoplayers component
  const [characterName, setCharacterName] = useState(""); // State to store character name

  // Function to handle successful login and receive the character name
  const handleLogin = (name) => {
    setLoggedIn(true);
    setCharacterName(name); // Set the character name
  };

  // Function to handle play with AI
  const handlePlayWithAI = () => {
    setPlayWithAI(true);
  };

  // Function to handle the completion of coin toss
  const handleCoinTossDone = () => {
    setCoinTossDone(true);
  };

  // Function to handle play with Two Players
  const handlePlayWithTwoPlayers = () => {
    setShowHome(false); // Disable Home component
    setShowTwoplayers(true); // Enable Twoplayers component
  };

  // Function to handle going back to Home from Twoplayers
  const handleBackToHome = () => {
    setShowHome(true); // Enable Home component
    setShowTwoplayers(false); // Disable Twoplayers component
  };

  return (
    <Router> 
      <div className="App">
        {!loggedIn ? ( 
          <Signin onLogin={handleLogin} />
        ) : playWithAI ? ( 
          <div>

             <Tictactoe />
          </div>
        ) : (
          <>
            {showHome && ( 
              <Home onPlayWithAI={handlePlayWithAI} onPlayWithTwoPlayers={handlePlayWithTwoPlayers} characterName={characterName} />
            )}
            {showTwoplayers && ( 
              <Twoplayers onBackToHome={handleBackToHome} />
            )}
          </>
        )}
      </div>
    </Router> 
  );
}

export default App;
