import React from 'react';

const Snake = ({ snakeDots }) => {
  return (
    <div>
      {snakeDots.map((dot, i) => (
        <div
          key={i}
          className="snake-dot"
          style={{ left: `${dot[0]}%`, top: `${dot[1]}%` }}
        ></div>
      ))}
    </div>
  );
};

export default Snake;
