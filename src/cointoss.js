import React, { useState } from 'react';
import './coinToss.css'; // Corrected file name
import headsImage from './resources/heads.png'; // Import heads image
import tailsImage from './resources/tails.png'; // Import tails image
import BlankImage from './resources/blank.png';
function CoinToss({ onCoinTossDone }) {
  const [tossing, setTossing] = useState(false);
  const [result, setResult] = useState(null); // Changed to null initially
  const [userChoice, setUserChoice] = useState(""); // State to store user's choice
  const [aiChoice, setAiChoice] = useState(""); // State to store AI's choice

  const handleToss = (choice) => {
    if (!tossing) {
      setTossing(true);
      setUserChoice(choice); // Set user's choice
      setTimeout(() => {
        const random = Math.random();
        const aiChoice = random < 0.5 ? 'heads' : 'tails';
        setAiChoice(aiChoice); // Set AI's choice
        const newResult = determineWinner(choice, aiChoice);
        setResult(newResult);

        setTimeout(() => {
          setTossing(false);
        }, 1000); // Reduced timing
      }, 2000); // Reduced timing
    }
  };

  // Function to determine the winner
  const determineWinner = (user, ai) => {
    if (user === ai) {
      return 'You WIN!';
    } else {
      return "AI wins!";
    }
  };

  const handleCoinTossDone = () => {
    if (result === 'You WIN!') {
      const userSymbol = 'X';
      onCoinTossDone(userSymbol);
    } else {
      onCoinTossDone();
    }
  };

  return (
    <div className="coin-toss">
      <div className={`coin ${tossing ? 'tossing' : ''}`}>
        <div className="front" style={{ backgroundImage: `url(${BlankImage})` }}></div>
        <div className="back" style={{ backgroundImage: `url(${BlankImage})` }}></div> 
      </div>
      <div>
        <button onClick={() => handleToss('heads')} disabled={tossing}><h2 className='Title2'>Choose Heads</h2></button>
        <button onClick={() => handleToss('tails')} disabled={tossing}><h2 className='Title2'>Choose Tails</h2></button>
      </div>
      {result && (
        <div>
          <img src={result === 'You WIN!' ? (userChoice === 'heads' ? headsImage : tailsImage) : (aiChoice === 'heads' ? headsImage : tailsImage)} alt="Result" />
          <p className="result"><h2 className='Title2'>Result: {result}</h2></p>
          
          <button onClick={handleCoinTossDone}><h2 className='Title2'>Continue</h2></button>
        </div>
      )}
    </div>
  );
}

export default CoinToss;
