import React from 'react';
import "./OverlayLoading.scss"
import "../../animation-loading/spinning/spinning.scss"

const OverlayLoading = () => {
  return (
    <>
      <div className="loading text-center flex flex-col justify-center">
        <div className="loading-text mt-4">
          <span className="loading-text-words text-[26px]">L</span>
          <span className="loading-text-words text-[26px]">O</span>
          <span className="loading-text-words text-[26px]">A</span>
          <span className="loading-text-words text-[26px]">D</span>
          <span className="loading-text-words text-[26px]">I</span>
          <span className="loading-text-words text-[26px]">N</span>
          <span className="loading-text-words text-[26px]">G</span>
        </div>
      </div>
    </>
  );
};

export default OverlayLoading;