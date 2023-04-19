import { faArrowLeft, faArrowRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';

const OverlayProduct = ({
  children,
  openOverlay,
  setOpenOverlay,
  imgProductsPreview }) => {
  const [translateShowX, setTranslateShowX] = useState(0)
  //

  return (
    <>
      <div className='w-full h-full relative'>
        {openOverlay && (
          <div
            className="wraper-review bg-black/20 absolute top-0 left-0 bottom-0 right-0 z-[10000]">
            <div className="relative w-[1000px] mx-auto flex items-center justify-center">
              {/* prev */}
              <div
                onClick={() => setTranslateShowX(translateShowX - 876)}
                className={`${translateShowX === 0 && 'hidden'} absolute cursor-pointer top-[50%] translate-y-[-50%] left-[-60px] flex items-center justify-center w-[66px] h-[66px] rounded-full bg-white z-50 shadow-shadowHover`}>
                <FontAwesomeIcon className=' text-[32px] text-bgPrimary' icon={faArrowLeft} />
              </div>
              <div className="cursor-pointer w-[876px] h-[586px] mx-auto whitespace-nowrap mt-[30px] rounded-[8px] relative z-[48] overflow-hidden">
                <div
                  onClick={() => setOpenOverlay(false)}
                  className="absolute hover:text-primary transition-all ease-linear duration-100 top-1 right-[6px] z-[100]">
                  <FontAwesomeIcon className='cursor-pointer text-[40px] p-2' icon={faXmark} />
                </div>
                <div style={{
                  transform: `translateX(-${translateShowX}px)`
                }}
                  className="h-full transition-all ease-in-out duration-300 rounded-[8px]">
                  {imgProductsPreview.map((imgProduct, idx) => (
                    <img
                      key={idx}
                      className='select-none pointer-events-none rounded-[8px] inline-flex w-[876px] h-full object-cover' src={imgProduct} alt="" />
                  ))}
                </div>
              </div>
              {/* next */}
              <div
                onClick={() => setTranslateShowX(translateShowX + 876)}
                className={`${translateShowX === (imgProductsPreview.length - 1) * 876 && 'hidden'} absolute cursor-pointer top-[50%] translate-y-[-50%] right-[-60px] flex items-center justify-center w-[66px] h-[66px] rounded-full bg-white z-50 shadow-shadowHover`}>
                <FontAwesomeIcon className=' text-[32px] text-bgPrimary' icon={faArrowRight} />
              </div>
            </div>
          </div>
        )}
        {children}
      </div>
    </>
  );
};

export default OverlayProduct;