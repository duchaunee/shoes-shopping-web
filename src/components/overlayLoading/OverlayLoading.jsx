import React from 'react';
import "./OverlayLoading.scss"
import "../../animation-loading/spinning/spinning.scss"

const OverlayLoading = () => {
  return (
    <>

      <div className="flex w-full max-h-[800px] items-center justify-center mb-20">
        <div className="boxes">
          <div className="box">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="box">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="box">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <div className="box">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        {/* <div className="">
          <div className="loading-text flex justify-center mt-28">
            <span className="loading-text-words font-medium text-[30px]">L</span>
            <span className="loading-text-words font-medium text-[30px]">O</span>
            <span className="loading-text-words font-medium text-[30px]">A</span>
            <span className="loading-text-words font-medium text-[30px]">D</span>
            <span className="loading-text-words font-medium text-[30px]">I</span>
            <span className="loading-text-words font-medium text-[30px]">N</span>
            <span className="loading-text-words font-medium text-[30px]">G</span>
          </div>
        </div> */}
      </div>


    </>
  );
};

export default OverlayLoading;