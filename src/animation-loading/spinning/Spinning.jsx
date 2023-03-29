import React from 'react';
import "./spinning.scss"

const Spinning = ({ color, size }) => {
  return (
    <div
      className='flex w-full h-full items-center justify-center relative'>
      <div className='mx-auto' id="preloader">
        <div
          style={{
            width: size,
            height: size,
            borderTopColor: color ? color : "#fff",
            borderRightColor: color ? color : "#fff",
          }}
          id="loader"></div>
      </div>
    </div>
  );
};

// border-top-color: #fff;
// border-right-color: #fff;
export default Spinning;