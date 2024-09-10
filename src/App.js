import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare })
{
  return (
    <button className={`square ${isWinningSquare ? 'winning-square' : ''}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay })
{
  const winnerInfo = calculateWinner(squares);
  const winner = winnerInfo.winner;
  const winningSquares = winnerInfo.winningSquares;

  function handleClick(i)
  {
    if (squares[i] || winnerInfo.winner)
    {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext)
    {
      nextSquares[i] = "X";
    } else
    {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }


  let status;
  if (winner)
  {
    status = "winner: " + winner;
  } else
  {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const boardRows = [];
  const boardSize = 3;
  for (let row = 0; row < boardSize; row++)
  {
    let squaresInRow = [];
    for (let col = 0; col < boardSize; col++)
    {
      const squareIndex = row * boardSize + col;
      const isWinningSquare = winningSquares.includes(squareIndex);

      squaresInRow.push(<Square
        key={squareIndex}
        value={squares[squareIndex]}
        onSquareClick={() => handleClick(squareIndex)}
        isWinningSquare={isWinningSquare}
      />)
    }
    boardRows.push(<div key={row} className="board-row">{squaresInRow}</div>)
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game()
{
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares)
  {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove)
  {
    setCurrentMove(nextMove);
  }

  function toggleSortOrder()
  {
    setIsAscending(!isAscending);
  }

  const moves = history.map((squares, move) =>
  {
    let description;

    if (move === currentMove)
    {
      description = `You are at move #${currentMove}`;
    }
    else if (move > 0)
    {
      description = 'Go to move #' + move;
    }
    else
    {
      description = 'Go to game start';
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  })

  const sortedMoves = isAscending ? moves : [...moves].reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={toggleSortOrder}>
          {isAscending ? 'Sort descending' : 'Sort ascending'}
        </button>
        <ol>{sortedMoves}</ol>
      </div>
    </div>
  )
}

function calculateWinner(squares)
{
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

  for (let i = 0; i < lines.length; i++)
  {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
    {
      return { winner: squares[a], winningSquares: [a, b, c] };
    }
  }

  return { winner: null, winningSquares: [] };
}
