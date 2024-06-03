// src/App.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Snake from './Snake';
import Food from './Food';
import './App.css';

const getRandomCoordinates = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  return [x, y];
};

const App = () => {
  const [snakeDots, setSnakeDots] = useState([[0, 0], [2, 0]]);
  const [food, setFood] = useState(getRandomCoordinates());
  const [direction, setDirection] = useState('RIGHT');
  const [speed, setSpeed] = useState(200);
  const [gameOver, setGameOver] = useState(false);

  // Create refs for audio elements
  const eatSound = useRef(null);
  const gameOverSound = useRef(null);

  useEffect(() => {
    const moveSnake = () => {
      let dots = [...snakeDots];
      let head = dots[dots.length - 1];

      switch (direction) {
        case 'RIGHT':
          head = [head[0] + 2, head[1]];
          break;
        case 'LEFT':
          head = [head[0] - 2, head[1]];
          break;
        case 'DOWN':
          head = [head[0], head[1] + 2];
          break;
        case 'UP':
          head = [head[0], head[1] - 2];
          break;
        default:
          break;
      }

      dots.push(head);
      dots.shift();
      setSnakeDots(dots);
    };

    if (!gameOver) {
      const interval = setInterval(moveSnake, speed);
      return () => clearInterval(interval);
    }
  }, [snakeDots, direction, speed, gameOver]);

  useEffect(() => {
    const onKeyDown = (e) => {
      e = e || window.event;
      switch (e.keyCode) {
        case 38:
          setDirection('UP');
          break;
        case 40:
          setDirection('DOWN');
          break;
        case 37:
          setDirection('LEFT');
          break;
        case 39:
          setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.onkeydown = onKeyDown;
  }, []);

  useEffect(() => {
    const checkIfOutOfBorders = () => {
      let head = snakeDots[snakeDots.length - 1];
      if (head[0] >= 100 || head[0] < 0 || head[1] >= 100 || head[1] < 0) {
        setGameOver(true);
      }
    };

    const checkIfCollapsed = () => {
      let snake = [...snakeDots];
      let head = snake[snake.length - 1];
      let body = snake.slice(0, -1); 
      for (let i = 0; i < body.length; i++) {
        if (head[0] === body[i][0] && head[1] === body[i][1]) {
          setGameOver(true);
          return;
        }
      }
    };
    
    const checkIfEat = () => {
      let head = snakeDots[snakeDots.length - 1];
      let foodDot = food;
      if (head[0] === foodDot[0] && head[1] === foodDot[1]) {
        setFood(getRandomCoordinates());
        enlargeSnake();
        increaseSpeed();
        // Play eat sound
        if (eatSound.current) {
          eatSound.current.play();
        }
      }
    };

    const enlargeSnake = () => {
      let newSnake = [...snakeDots];
      newSnake.unshift([]);
      setSnakeDots(newSnake);
    };

    const increaseSpeed = () => {
      if (speed > 10) {
        setSpeed(speed - 10);
      }
    };

    checkIfOutOfBorders();
    checkIfCollapsed();
    checkIfEat();
  }, [snakeDots, food, speed]);

  const onGameOver = useCallback(() => {
    setGameOver(true);
    alert(`Game Over. Snake length is ${snakeDots.length}`);
    setSnakeDots([[0, 0], [2, 0]]);
    setFood(getRandomCoordinates());
    setDirection('RIGHT');
    setSpeed(200);
    setGameOver(false);
    if (gameOverSound.current) {
      gameOverSound.current.play();
    }
  }, [snakeDots.length]);

  useEffect(() => {
    if (gameOver) {
      onGameOver();
    }
  }, [gameOver, onGameOver]);

  return (
    <div className="game-area">
      <Snake snakeDots={snakeDots} />
      <Food dot={food} />
      {}
      <audio ref={eatSound} src="/eat.mp3" />
      <audio ref={gameOverSound} src="/game-over.mp3" />
    </div>
  );
};

export default App;
