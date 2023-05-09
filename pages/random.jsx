import React from 'react';

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function Random() {
  const randomInt = getRandomInt(120);

  return (
    <div>
      <h1>{randomInt}</h1>
    </div>
  );
}

export default Random;