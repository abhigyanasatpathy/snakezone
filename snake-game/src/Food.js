import React from 'react';

const Food = ({ dot }) => {
  return (
    <div className="snake-food" style={{ left: `${dot[0]}%`, top: `${dot[1]}%` }}></div>
  );
};

export default Food;
