import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase'; // Import your firebase.js file
import { doc, setDoc, getDoc, updateDoc, increment, disablePersistentCacheIndexAutoCreation } from 'firebase/firestore';
import './tictactoe.css';

const HUMAN_PLAYER_1 = 'X';
const HUMAN_PLAYER_2 = 'O';

const createNewPlayer = async (uid, displayName, password) => {
    try {
    // Construct document reference with collection and document ID
    const playerRef = doc(db, 'players', displayName); // Use displayName as the document ID
    const playerSnapshot = await getDoc(playerRef);
    if (playerSnapshot.exists()) {
     
        const userPassword = prompt('Please enter your password for verification:');
        password=userPassword;
        if (userPassword !== password ) {
          alert('Incorrect password. Please try again.');

          return; // Don't proceed further if password is incorrect
        }
        else if(userPassword == password && userPassword!=null){
  alert('Welcome Back! '+displayName);
        }
      
     
    } 
    if (!playerSnapshot.exists()) {
      const newPassword = prompt('Please create a password for your account:');
      password = newPassword; // Update password with the new one
      alert('Player created successfully!');

      // If not, add a new document
      await setDoc(playerRef, {
        uid: uid,
        wins: 0,
        losses: 0,
        displayName: displayName,
        timestamp: new Date().toISOString(),
        password:password

      });
      console.log("Player document created successfully!");
    } else {
      // If exists, update the existing document
      await updateDoc(playerRef, {
        uid: uid, // Update uid just in case
        displayName: displayName,
        timestamp: new Date().toISOString()
      });
      console.log("Player document updated successfully!");
    }
  } catch (error) {
    console.error("Error creating/updating player document: ", error);
  }
};

function checkWinner(board, player) {
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

function isBoardFull(board) {
  for (let row of board) {
    if (row.includes('')) {
      return false;
    }
  }
  return true;
}

function App() {
  
  const currentPlayerText = () => {
    return gameOver
      ? "Game Over"
      : `Current Player: ${currentPlayer === HUMAN_PLAYER_1 ? player1Name : player2Name}`;
  };
  const [board, setBoard] = useState([
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ]);

  const [password, setPassword] = useState('');

  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const [playersLoggedIn, setPlayersLoggedIn] = useState(false); // State to track if both players are logged in
  const [playersReady, setPlayersReady] = useState(false); // State to track if both players have set their names
  const [player1Symbol, setPlayer1Symbol] = useState('');
  const [player2Symbol, setPlayer2Symbol] = useState('');
  const [currentPlayer, setCurrentPlayer] = useState(HUMAN_PLAYER_1);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [player1Wins, setPlayer1Wins] = useState(0);
  const [player2Wins, setPlayer2Wins] = useState(0);
  const [player1Losses, setPlayer1Losses] = useState(0);
  const [player2Losses, setPlayer2Losses] = useState(0);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  useEffect(() => {
    const fetchPlayerStats = async () => {
      if (player1Name.trim() && player2Name.trim()) {
        try {
          const player1Snapshot = await getDoc(doc(db, 'players', player1Name));
          const player2Snapshot = await getDoc(doc(db, 'players', player2Name));
          
          if (player1Snapshot.exists() && player2Snapshot.exists()) {
            setPlayer1Wins(player1Snapshot.data().wins || 0);
            setPlayer2Wins(player2Snapshot.data().wins || 0);
            setPlayer1Losses(player1Snapshot.data().losses || 0);
            setPlayer2Losses(player2Snapshot.data().losses || 0);
            setPlayer1Name(player1Snapshot.data().displayName || '');
            setPlayer2Name(player2Snapshot.data().displayName || '');
          }
        } catch (error) {
          console.error("Error fetching player stats: ", error);
        }
      }
    };
  
    if (auth.currentUser) {
      fetchPlayerStats();
    }
  }, [player1Name, player2Name]);
  
  const makeMove = (row, col) => {
    if (!board[row][col] && !gameOver) {
      const newBoard = [...board];
      newBoard[row][col] = currentPlayer;
      setBoard(newBoard);

      if (checkWinner(newBoard, currentPlayer)) {
        setGameOver(true);
        setWinner(currentPlayer);
        if (currentPlayer === HUMAN_PLAYER_1) {
          updatePlayerWins(player1Name);
          updatePlayerLosses(player2Name);
        } else {
          updatePlayerWins(player2Name);
          updatePlayerLosses(player1Name);
        }
      } else if (isBoardFull(newBoard)) {
        setGameOver(true);
        setWinner('');
      } else {
        setCurrentPlayer(currentPlayer === HUMAN_PLAYER_1 ? HUMAN_PLAYER_2 : HUMAN_PLAYER_1);
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
    setCurrentPlayer(HUMAN_PLAYER_1);
  };

  const handlePlayer1Selection = (symbol) => {
    setPlayer1Symbol(symbol);
  };

  const handlePlayer2Selection = (symbol) => {
    setPlayer2Symbol(symbol);
  };

  const updatePlayerWins = async (username) => {
    // Construct document reference with collection and document ID
    const playerRef = doc(db, 'players', username);
    const playerSnapshot = await getDoc(playerRef);
    const currentWins = playerSnapshot.data().wins;
    await updateDoc(playerRef, {
      wins: increment(1), // Increment wins by 1
      timestamp: new Date().toISOString() // Update timestamp
    });

    // Update state based on the current player's symbol
    if (currentPlayer === HUMAN_PLAYER_1) {
      setPlayer1Wins(currentWins + 1); // Update state with the new value
    } else {
      setPlayer2Wins(currentWins + 1); // Update state with the new value
    }
  };

  const updatePlayerLosses = async (username) => {
    // Construct document reference with collection and document ID
    const playerRef = doc(db, 'players', username);
    const playerSnapshot = await getDoc(playerRef);
    const currentLosses = playerSnapshot.data().losses;
    await updateDoc(playerRef, {
      losses: increment(1), // Increment losses by 1
      timestamp: new Date().toISOString() // Update timestamp
    });

    // Update state based on the current player's symbol
    if (currentPlayer === HUMAN_PLAYER_1) {
      setPlayer1Losses(currentLosses + 1); // Update state with the new value
    } else {
      setPlayer2Losses(currentLosses + 1); // Update state with the new value
    }
  };

  const handlePlayer1NameChange = (e) => {
    setPlayer1Name(e.target.value);
  };

  const handlePlayer2NameChange = (e) => {
    setPlayer2Name(e.target.value);
  };

  const handlePlayer1NameSubmit = () => {
    if (player1Name.trim() !== '') {
      createNewPlayer('player1', player1Name);
    }
  };

  const handlePlayer2NameSubmit = () => {
    if (player2Name.trim() !== '') {
      createNewPlayer('player2', player2Name);
    }
  };
  const displayPlayerStats = () => {
    return (
      <div className="player-stats">
        <h2 className='Title2'>Player Stats</h2>
        <h2 className='Title2'>{player1Name}: Wins - {player1Wins}, Losses - {player1Losses}</h2>
        <h2 className='Title2'>{player2Name}: Wins - {player2Wins}, Losses - {player2Losses}</h2>
      </div>
    );
  };

  return (
    <div className="App">
      <h1 className='Title'>Tic Tac Toe</h1>
      <div className="symbol-selection">
        <div className='player1stuff'>
        <h2 className='Title2'>Player 1</h2>
        <input
          type="text"
          value={player1Name}
          onChange={handlePlayer1NameChange}
          placeholder="Enter Player 1 Name"
        />
         <button onClick={handlePlayer1NameSubmit}><h2 className='Title2'>Set Player 1 Name</h2>
</button>

        
        </div>
       
        <div className='player1stuff'>

       
        <h2 className='Title2'>Player 2</h2>
        <input
          type="text"
          value={player2Name}
          onChange={handlePlayer2NameChange}
          placeholder="Enter Player 2 Name"
        />
    
        <button onClick={handlePlayer2NameSubmit}><h2 className='Title2'>Set Player 2 Name</h2>
</button>

</div>
      </div>
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
      <div className="current-player">{currentPlayerText()}</div>

      {gameOver && (
        <div className="result">
          {winner ? `${winner} wins!` : "It's a tie!"}
          <button onClick={resetGame}><h2 className='Title2'>Play Again</h2></button>
          {/* Display player stats after game over */}
          {displayPlayerStats()}
        </div>
      )}
    </div>
  );
}

export default App;
