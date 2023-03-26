import React from 'react';

const Card = ({ children }) => {
  return (
    <div className='m-[10px] inline-flex shadow-shadowPrimary hover:shadow-shadowHover transition-all ease-linear delay-[0.1s]'>
      {children}
    </div>
  );
};

export default Card;