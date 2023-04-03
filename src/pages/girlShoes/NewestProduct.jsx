import React from 'react';
import { NavLink } from 'react-router-dom';
import "../../components/lineClamp.scss"

const solvePrice = (price) => {
  return Math.floor(price).toLocaleString('en-US')
}

const NewestProduct = ({ productDemo }) => {
  return (
    <>
      <div className="w-full mt-10">
        <p className='font-bold mb-5 text-bgPrimary text-[16px] uppercase tracking-widest'>Sản phẩm</p>
        <ul className="p-[15px] pb-0 bg-[#fcfcfc] border border-solid border-[#ddd] flex flex-col gap-1">
          {productDemo.map((item, idx) => (
            <li
              key={idx}
              className={`min-h-[80px] flex gap-4 ${idx > -1 && "border border-transparent border-dashed border-t-[#ececec]"}`}>
              <img className='w-[60px] h-[60px] object-cover' src={item.imgURL} alt="" />
              <div className="flex-1">
                <NavLink className='block text-[#334862] text-[14px] mb-1 line-clamp-1'>{item.name}</NavLink>
                <span className='text-[#111111] font-bold text-[14px]'>{solvePrice(item.price)} ₫</span>
              </div>
            </li>
          ))}
          {/* <li className='min-h-[80px] pt-[10px] pb-[5px] flex gap-4'>
            <img className='w-[60px] h-[60px] object-cover' src="https://source.unsplash.com/random" alt="" />
            <div className="flex-1">
              <NavLink className='block text-[#334862] text-[14px] mb-5'>Chuck 70 Psy-Kicks Ox </NavLink>
              <span className='text-[#111111] font-bold text-[14px]'>2,800,000 ₫</span>
            </div>
          </li>
          <li className='min-h-[80px] pt-[10px] pb-[5px] flex gap-4 border border-transparent border-dashed border-t-[#ececec]'>
            <img className='w-[60px] h-[60px] object-cover' src="https://source.unsplash.com/random" alt="" />
            <div className="flex-1">
              <NavLink className='block text-[#334862] text-[14px] mb-5'>Chuck 70 Psy-Kicks Ox </NavLink>
              <span className='text-[#111111] font-bold text-[14px]'>2,800,000 ₫</span>
            </div>
          </li> */}

        </ul>
      </div>
    </>
  );
};

export default NewestProduct;