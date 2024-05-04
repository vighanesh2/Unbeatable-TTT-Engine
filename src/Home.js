import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Home.css';
import logo from './resources/logo.png';
import Charac from './resources/example.gif';

function Home({ onPlayWithAI, onPlayWithTwoPlayers, characterName }) {
  const handlePlayWithAI = () => {
    onPlayWithAI();
  };

  const handlePlayWithTwoPlayers = () => {
    onPlayWithTwoPlayers();
  };

  return (
    <div className='HomeApp'>
      <div className='section3'>
        <div className='leftsection'>
          <div className='logodiv'>
            <img src={logo} alt="Logo" />
          </div>
          <h1 className='Title-left'>XpertO</h1>
          <h2 className='Title2'>Welcome {characterName}!</h2>
          {/* Display the character name */}
        </div>
        <div className='rightsection'>
          <div className='gif'>
            <img src={Charac} className='gifname' alt="Character" />
          </div>
          <button className='Title3' onClick={handlePlayWithTwoPlayers}>2 Players</button>
          <button className='Title3' onClick={handlePlayWithAI}>Play with AI</button>
        </div>
      </div>
      <div className='leaderboard'>
        <main>
          <div id="rules">
            <h1 className='Title'>Game Rules</h1>
            <h2 className='Title2'>X Rules:</h2>
            <p>X can go first or second</p>
            <p>The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row wins the game.</p>
            <p>If all 9 squares are filled and no player has achieved a winning condition, the game is a draw.</p>

            <h2 className='Title2'>O Rules:</h2>
            <p>O can go in any order as well</p>
            <p>The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row wins the game.</p>
            <p>If all 9 squares are filled and no player has achieved a winning condition, the game is a draw.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
