import React, { useState, useEffect } from 'react';
import './tictactoe.css';
import CoinToss from './cointoss'; // Fix the import path
import celebrationMusic from './resources/celebration.mp3'; // Import your celebration music file

// Define constants for players
let HUMAN_PLAYER = 'X';
const COMPUTER_PLAYER = 'O';

// Function to check for a winner
function checkWinner(board, player) {
  // Check rows, columns, and diagonals
  for (let i = 0; i < 3; i++) {
    if (
      (board[i][0] === player && board[i][1] === player && board[i][2] === player) ||
      (board[0][i] === player && board[1][i] === player && board[2][i] === player)
    ) {
      return true;
    }
  }

  if (
    (board[0][0] === player && board[1][1] === player && board[2][2] === player) ||
    (board[0][2] === player && board[1][1] === player && board[2][0] === player)
  ) {
    return true;
  }

  return false;
}

// Function to check if the board is full
function isBoardFull(board) {
  for (let row of board) {
    if (row.includes('')) {
      return false;
    }
  }
  return true;
}

// Minimax function
function minimax(board, depth, isMaximizing) {
  if (checkWinner(board, COMPUTER_PLAYER)) {
    return 10 - depth;
  } else if (checkWinner(board, HUMAN_PLAYER)) {
    return depth - 10;
  } else if (isBoardFull(board)) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          board[i][j] = COMPUTER_PLAYER;
          let score = minimax(board, depth + 1, false);
          board[i][j] = '';
          bestScore = Math.max(bestScore, score);
        }
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === '') {
          board[i][j] = HUMAN_PLAYER;
          let score = minimax(board, depth + 1, true);
          board[i][j] = '';
          bestScore = Math.min(bestScore, score);
        }
      }
    }
    return bestScore;
  }
}

// Function to make the best move for the computer
function makeBestMove(board) {
  let bestScore = -Infinity;
  let move = { row: -1, col: -1 };

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === '') {
        board[i][j] = COMPUTER_PLAYER;
        let score = minimax(board, 0, false);
        board[i][j] = '';
        if (score > bestScore) {
          bestScore = score;
          move.row = i;
          move.col = j;
        }
      }
    }
  }

  return move;
}

function App({ userSymbol }) {
  const [board, setBoard] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);

  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [humanTurn, setHumanTurn] = useState(true);
  const [coinTossDone, setCoinTossDone] = useState(false); // Track if coin toss is done
  const [musicMuted, setMusicMuted] = useState(false); // Track if music is muted
  const [showCelebration, setShowCelebration] = useState(false); // Track if celebration should be shown

  const [aiScore, setAiScore] = useState(0); // Initialize AI's score
  const [userScore, setUserScore] = useState(0); // Initialize user's score

  useEffect(() => {
    // If coin toss is not done yet, wait for it
    if (!coinTossDone) return;

    if (!humanTurn && !gameOver) {
      setTimeout(() => {
        const move = makeBestMove(board);
        makeMove(move.row, move.col);
      }, 500); // Delay for AI move for better user experience
    }
  }, [humanTurn, board, gameOver, coinTossDone]);

  const makeMove = (row, col) => {
    if (!board[row][col] && !gameOver) {
      const newBoard = [...board];
      newBoard[row][col] = humanTurn ? HUMAN_PLAYER : COMPUTER_PLAYER;
      setBoard(newBoard);
      setHumanTurn(!humanTurn);

      if (checkWinner(newBoard, HUMAN_PLAYER)) {
        setGameOver(true);
        setWinner(HUMAN_PLAYER);
        setUserScore(userScore + 1); // Increment user's score
      } else if (checkWinner(newBoard, COMPUTER_PLAYER)) {
        setGameOver(true);
        setWinner(COMPUTER_PLAYER);
        setAiScore(aiScore + 1); // Increment AI's score
        setShowCelebration(true); // Trigger celebration when AI wins
      } else if (isBoardFull(newBoard)) {
        setGameOver(true);
      }
    }
  };

  const resetGame = () => {
    setBoard([
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ]);
    setGameOver(false);
    setWinner('');
    setHumanTurn(true); // Reset to AI playing first
    setCoinTossDone(false); // Reset coin toss
    setShowCelebration(false); // Reset celebration
  };

  // Callback function to handle coin toss result
  const handleCoinTossDone = (result) => {
    if (result === userSymbol) {
      setHumanTurn(false); // User goes first
    } else {
      setHumanTurn(true); // AI goes first
    }
    setCoinTossDone(true);
  };
  const changeUserSymbol = (symbol) => {
    HUMAN_PLAYER = symbol;
    setCoinTossDone(true); // Set coin toss as done to prevent repetition
  };

  const toggleMusicMute = () => {
    setMusicMuted(!musicMuted);
  };

  return (
    <div className="App">
      {!coinTossDone && <CoinToss onCoinTossDone={handleCoinTossDone} />} {/* Display coin toss only if it's not done */}
      {coinTossDone && (
        <div className='Tictac'>
          <h1 className='Title'>Tic Tac Toe</h1>
          <div className="board">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    className={`cell ${cell}`}
                    onClick={() => makeMove(rowIndex, colIndex)}
                  >
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="scoreboard">
            <h2 className='Title2'>AI: {aiScore}</h2>
            <h2 className='Title2'>YOU: {userScore}</h2>
          </div>
          <div className="settings">
            <h2 className='Title2'>Settings</h2>
            <div>
              <span><h2 className='Title2'>Change Your Symbol</h2>:</span>
              <button onClick={() => changeUserSymbol('❌')}>❌</button>
              <button onClick={() => changeUserSymbol('🐱')}>🐱</button>
              <button onClick={() => changeUserSymbol('🐶')}>🐶</button>
              <button onClick={() => changeUserSymbol('🐻')}>🐻</button>
              <button onClick={() => changeUserSymbol('🦄')}>🦄</button>
              <button onClick={() => changeUserSymbol('🐍')}>🐍</button>
              <button onClick={() => changeUserSymbol('🦖')}>🦖</button>
              <button onClick={() => changeUserSymbol('🦁')}>🦁</button>
              <button onClick={() => changeUserSymbol('🐝')}>🐝</button>
              <button onClick={() => changeUserSymbol('🐼')}>🐼</button>
              <button onClick={() => changeUserSymbol('🐯')}>🐯</button>
              <button onClick={() => changeUserSymbol('🐨')}>🐨</button>
              <button onClick={() => changeUserSymbol('🦊')}>🦊</button>
              <button onClick={() => changeUserSymbol('🐵')}>🐵</button>
            </div>
            <div>
              <button onClick={toggleMusicMute}>{musicMuted ? 'Unmute Music' : 'Mute Music'}</button>
            </div>
          </div>
          {gameOver && (
            <div className="result">
              {winner ? `${winner} wins!` : "It's a tie!"}
              <button onClick={resetGame}>Play Again</button>
            </div>
          )}
          {showCelebration && (
            <div className="celebration">
              <audio autoPlay={!musicMuted} loop={!musicMuted} muted={musicMuted}>
                <source src={celebrationMusic} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
