import React from 'react';
import BgHomeAdmin from './BgHomeAdmin';

const HomeAdmin = () => {
  return (
    <div className="w-full h-full flex flex-col gap-5">
      {/* <span className='text-bgPrimary text-[35px] font-bold'>Home</span> */}
      <div className="w-full h-[200px] flex gap-5">
        <div className="flex-1 h-full shadow-shadowHover rounded-[12px] overflow-hidden">
          <h1 className="text-[20px] text-black font-semibold mt-5 ml-5 uppercase">Tổng số tiền thu được</h1>
          <BgHomeAdmin />
        </div>
        <div className="flex-1 h-full shadow-shadowHover rounded-[12px]">
        </div>
        <div className="flex-1 h-full shadow-shadowHover rounded-[12px]">
        </div>
      </div>
      <div className="w-full bg-red-600 flex-1 rounded-[12px]"></div>
    </div>
  );
};

export default HomeAdmin;