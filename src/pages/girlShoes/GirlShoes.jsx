import React from 'react';
import { NavLink } from 'react-router-dom';

const GirlShoes = () => {
  return (
    <>
      <div className="max-w-[1230px] px-[15px] mx-auto min-h-[60px] pt-5 flex items-center justify-between">
        <div className="flex-1">
          <NavLink className='uppercase text-[18px] text-[#95959f]'>Trang chủ</NavLink>
          <div className="mx-2 inline-block">/</div>
          <span className='uppercase text-[18px] font-bold '>Nữ</span>
        </div>
        <div className="flex items-center">
          <p className='inline-block text-[16px] text-[#353535] mr-8'>Hiển thị 1-12 trong 22 kết quả</p>
          <select
            className='outline-none mr-[12px] rounded-[4px] bg-slate-100 px-3 py-3 pr-16 text-bgPrimary cursor-pointer border border-solid border-[#ddd] shadow-shadowSearch'
            name="sort-by" id="">
            <option key='0' value="">Sắp xếp theo</option>
            <option key='1' value="latest">Mới nhất</option>
            <option key='2' value="oldest">Cũ nhất</option>
            <option key='3' value="lowest-price">Giá tăng dần</option>
            <option key='4' value="highest-price">Giá giảm dần</option>
            <option key='5' value="a-z">A - Z</option>
            <option key='6' value="z-a">Z - A</option>
          </select>
        </div>
      </div>

      <div className="w-full h-[300px] bg-red-300">
        <div className="max-w-[1230px] pt-[30px] flex">
          <div className="max-w-[25%] px-[15px] pb-[30px]">
            <div className="w-full ">
              <div className="w-full">
                <p className=''>Lọc theo giá</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GirlShoes;