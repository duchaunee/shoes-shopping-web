import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectUserID, selectUserName } from '../../redux-toolkit/slice/authSlice';
import StarsRating from 'react-star-rate';
import './review.scss'
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const Review = ({ children, id, openReview, setOpenReview }) => {
  const overlayRef = useRef(null)
  //
  const [rate, setRate] = useState('');
  const [review, setReview] = useState('');
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')
  const displayName = useSelector(selectUserName) || localStorage.getItem('displayName')

  const MAX_WORDS = 180;
  const handleChange = (e) => {
    e.preventDefault()
    const words = e.target.value.trim()
    if (words.length > MAX_WORDS) {
      const truncatedWords = words.slice(0, MAX_WORDS);
      setReview(truncatedWords.trim());
      toast.warn('Giới hạn của ô là 180 ký tự', {
        autoClose: 1200,
        position: 'top-left'
      })
    } else {
      setReview(e.target.value);
    }
  };

  const handleClickOutside = (e) => {
    e.preventDefault()
    if (e.target.contains(overlayRef.current) && openReview) {
      setOpenReview(false)
    }
  }

  return (
    <>
      <div
        className='w-full h-full relative'>
        {openReview && (
          <div
            ref={overlayRef}
            onClick={handleClickOutside}
            className="wraper-review bg-black/20 absolute top-[-100px] left-0 bottom-0 right-0 z-[10000]">
            <div className="relative review w-[520px] mx-auto px-6 py-6 bg-white rounded-[8px] mt-[216px]">
              <div
                onClick={() => setOpenReview(false)}
                className="absolute hover:text-primary transition-all ease-linear duration-100 top-1 right-[6px]">
                <FontAwesomeIcon className='cursor-pointer text-[30px] p-2' icon={faXmark} />
              </div>
              <h1 className="text-[18px] font-bold text-bgPrimary uppercase">
                Đánh giá đơn hàng
              </h1>
              <div className="">
                <StarsRating
                  value={rate}
                  onChange={rate => {
                    setRate(rate);
                  }}
                />
              </div>
              <div className="mt-7 relative bg-[#f2f2f4]">
                <div className="absolute top-0 left-[20px] w-[168px] h-[3px] bg-[#f2f2f4]"></div>
                <label
                  htmlFor='review'
                  className='absolute inline-block font-medium cursor-pointer top-0 left-[20px] px-[5px] text-[16px] translate-y-[-50%] text-bgPrimary'>
                  Đánh giá về sản phẩm
                </label>
                <textarea
                  value={review}
                  onChange={handleChange}
                  required
                  className='px-[15px] py-5 pl-[20px] block w-full h-full text-[16px] border border-solid border-bgPrimary rounded-[4px] bg-transparent text-bgPrimary outline-none resize-none'
                  cols="30"
                  rows='4'
                  autoComplete="off"
                  type="text"
                  id='review'
                  placeholder='Bạn có đóng góp gì về sản phẩm này? (Giới hạn 200 ký tự)' />
              </div>
              <NavLink
                className='inline-block bg-primary text-white px-4 py-2 hover:bg-[#a40206] transition-all ease-linear duration-[120ms] mt-6 rounded-[8px]'>
                <span className='tracking-wider uppercase text-[16px] font-medium'>Gửi đánh giá của bạn</span>
              </NavLink>
            </div>
          </div>
        )}
        {children}
      </div>
    </>
  );
};

export default Review;