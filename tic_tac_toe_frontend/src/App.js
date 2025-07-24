import React, { useState, useEffect } from 'react';
import './App.css';

// Color palette per work item
const COLORS = {
  primary: '#009688',
  secondary: '#263238',
  accent: '#FF9800',
  boardBg: '#f8f9fa',
  boardBorder: '#e0e0e0',
  cellShadow: '0 1px 4px rgba(0,0,0,0.05)',
};

const PLAYERS = {
  X: {
    name: 'Player 1',
    symbol: 'X',
    color: COLORS.primary
  },
  O: {
    name: 'Player 2',
    symbol: 'O',
    color: COLORS.accent
  }
};

// Helper to check game winner or draw
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let [a, b, c] of lines) {
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  if (squares.every(Boolean)) return 'DRAW';
  return null;
}

// PUBLIC_INTERFACE
function App() {
  // Board state: 9 cells, null | 'X' | 'O'
  const [squares, setSquares] = useState(Array(9).fill(null));
  // true: X's turn, false: O's turn
  const [xIsNext, setXIsNext] = useState(true);
  // Game status: null, 'X', 'O', 'DRAW'
  const winner = calculateWinner(squares);

  // Accessibility: Announce winner/state to screen readers
  useEffect(() => {
    if (winner && winner !== 'DRAW') {
      document.title = `Winner: ${PLAYERS[winner].name}`;
    } else if (winner === 'DRAW') {
      document.title = 'Draw!';
    } else {
      document.title = `${xIsNext ? PLAYERS.X.name : PLAYERS.O.name}'s turn`;
    }
  }, [winner, xIsNext]);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (squares[idx] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  // PUBLIC_INTERFACE
  function renderStatus() {
    if (winner && winner !== 'DRAW') {
      return <span data-testid="status-winner">Winner: <span style={{color: PLAYERS[winner].color}}>{PLAYERS[winner].name}</span></span>;
    }
    if (winner === 'DRAW') {
      return <span data-testid="status-draw">It's a Draw!</span>;
    }
    const currentPlayer = xIsNext ? PLAYERS.X : PLAYERS.O;
    return (
      <span>
        <span style={{color: currentPlayer.color}}>
          {currentPlayer.name}'s turn
        </span>
      </span>
    );
  }

  // PUBLIC_INTERFACE
  function renderBoard() {
    return (
      <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
        {squares.map((cell, idx) => (
          <button
            key={idx}
            className="ttt-cell"
            aria-label={cell ? `Cell ${idx+1}, ${cell}` : `Cell ${idx+1}, empty`}
            type="button"
            tabIndex={0}
            style={cell ? {
              color: PLAYERS[cell].color,
            } : undefined}
            disabled={!!cell || !!winner}
            onClick={() => handleClick(idx)}
            data-testid={`cell-${idx}`}
          >
            {cell}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      className="ttt-root"
      style={{
        background: COLORS.boardBg,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <main className="ttt-container" style={{width: '100%', maxWidth: 360, margin: 'auto', boxSizing: 'border-box', padding:'24px 12px'}}>
        <h1 className="ttt-title" style={{fontWeight:600, fontSize:'2rem', marginBottom:6, color:COLORS.secondary, letterSpacing:'-0.5px'}}>Tic Tac Toe</h1>
        <div className="ttt-status" aria-live="polite" style={{marginBottom:'1.2em', fontWeight:500, fontSize:'1.12rem'}}>
          {renderStatus()}
        </div>
        {renderBoard()}
        <button
          className="ttt-restart-btn"
          type="button"
          aria-label="Restart game"
          onClick={handleRestart}
        >
          Restart
        </button>
        <section className="ttt-legend" aria-label="Player colors" style={{marginTop:24, display:'flex', gap:15, justifyContent:'center', fontSize:'0.98rem'}}>
          <span><b style={{color:COLORS.primary}}>X</b> = Player 1</span>
          <span><b style={{color:COLORS.accent}}>O</b> = Player 2</span>
        </section>
      </main>
    </div>
  );
}

export default App;
