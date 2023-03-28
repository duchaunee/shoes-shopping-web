import React from 'react';

const HomeAdmin = () => {
  return (
    <div className="w-full h-full flex flex-col gap-5">
      {/* <span className='text-bgPrimary text-[35px] font-bold'>Home</span> */}
      <div className="w-full h-[200px] flex gap-5 ">
        <div className="flex-1 h-full bg-emerald-300 rounded-[12px]">
        </div>
        <div className="flex-1 h-full bg-red-300 rounded-[12px]">
        </div>
        <div className="flex-1 h-full bg-blue-300 rounded-[12px]">
        </div>
      </div>
      <div className="w-full bg-red-600 flex-1 rounded-[12px]"></div>
    </div>
  );
};

export default HomeAdmin;