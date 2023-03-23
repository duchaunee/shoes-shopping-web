import React from 'react';
import "./cascade.scss"

const cascade = () => {
  return (
    <div>
      <div className="cascade">
        {Array(5).fill().map(() => (
          <div></div>
        ))}
      </div>
    </div>
  );
};

export default cascade;