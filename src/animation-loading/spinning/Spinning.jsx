import React from 'react';
import "./spinning.scss"

const Spinning = () => {
  return (
    <div className='flex w-full relative'>
      <div className='mx-auto' id="preloader">
        <div id="loader"></div>
      </div>
    </div>
  );
};

export default Spinning;