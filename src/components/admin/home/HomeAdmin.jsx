import React from 'react';
import BgHomeAdmin from './BgHomeAdmin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faDollarSign, faTruck, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const HomeAdmin = () => {
  return (
    <div className="w-full h-full flex flex-col gap-5">
      {/* <span className='text-bgPrimary text-[35px] font-bold'>Home</span> */}
      <div className="w-full h-[150px] flex gap-6">

        <div className="relative flex-1 h-full shadow-shadowHover rounded-tl-[12px] rounded-tr-[12px] border-l-0 border-r-0 flex justify-center items-center gap-4 border-[6px] border-transparent border-b-[#f25a7f]">
          <div className="absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-25%] w-[55px] aspect-square rounded-full bg-[#f25a7f]/80 flex items-center justify-center">
            <FontAwesomeIcon className='text-[20px] text-white' icon={faUserPlus} />
          </div>
          <div className="flex flex-col items-center mt-6">
            <p className="text-[24px] font-medium">15</p>
            <span className="text-[14px] text-[#666] tracking-wider">Khách hàng</span>
          </div>
        </div>

        <div className="relative flex-1 h-full shadow-shadowHover rounded-tl-[12px] rounded-tr-[12px] border-l-0 border-r-0 flex justify-center items-center gap-4 border-[6px] border-transparent border-b-[#5183cb]">
          <div className="absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-25%] w-[55px] aspect-square rounded-full bg-[#5183cb]/80 flex items-center justify-center">
            <FontAwesomeIcon className='text-[20px] text-white' icon={faCartShopping} />
          </div>
          <div className="flex flex-col items-center mt-6">
            <p className="text-[24px] font-medium">40</p>
            <span className="text-[14px] text-[#666] tracking-wider">Sản phẩm</span>
          </div>
        </div>

        <div className="relative flex-1 h-full shadow-shadowHover rounded-tl-[12px] rounded-tr-[12px] border-l-0 border-r-0 flex justify-center items-center gap-4 border-[6px] border-transparent border-b-[#fb963a]">
          <div className="absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-25%] w-[55px] aspect-square rounded-full bg-[#fb963a]/80 flex items-center justify-center">
            <FontAwesomeIcon className='text-[20px] text-white' icon={faTruck} />
          </div>
          <div className="flex flex-col items-center mt-6">
            <p className="text-[24px] font-medium">12</p>
            <span className="text-[14px] text-[#666] tracking-wider">Đơn hàng</span>
          </div>
        </div>

        <div className="relative flex-1 h-full shadow-shadowHover rounded-tl-[12px] rounded-tr-[12px] border-l-0 border-r-0 flex justify-center items-center gap-4 border-[6px] border-transparent border-b-[#fe5c3a]">
          <div className="absolute left-[50%] top-0 translate-x-[-50%] translate-y-[-25%] w-[55px] aspect-square rounded-full bg-[#fe5c3a]/80 flex items-center justify-center">
            <FontAwesomeIcon className='text-[24px] text-white' icon={faDollarSign} />
          </div>
          <div className="flex flex-col items-center mt-6">
            <p className="text-[24px] font-medium">205.500.000</p>
            <span className="text-[14px] text-[#666] tracking-wider">Doanh thu (VNĐ)</span>
          </div>
        </div>
      </div>
      <div className="w-full bg-red-600 flex-1 rounded-[12px]"></div>
    </div>
  );
};

export default HomeAdmin;