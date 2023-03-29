import React from 'react';
import { faFolder, faHome, faMountain, faPlus } from '@fortawesome/free-solid-svg-icons';
import NavActive from './NavActive';
import { useSelector } from 'react-redux';

const NavAdmin = () => {
  const displayName = useSelector(state => state.auth.userName)
  return (
    <div className="rounded-tl-[12px] rounded-bl-[12px] p-[20px] pt-0 w-[270px] shadow-xl">
      <div className="w-full py-[20px] flex flex-col items-center mb-[10px]">
        <img
          className='w-[100px] h-[100px] rounded-full mb-2'
          src="/adminLogo.png" alt="" />
        <span className='block font-[500] text-center text-bgPrimary text-[20px]'>{displayName}</span>
      </div>
      <ul className='w-full'>
        <NavActive to='home' icon={faHome} text='Thống kê' />
        <NavActive to='view-products' icon={faMountain} iconSize='text-[22px]' text='Xem sản phẩm' />
        <NavActive to='add-product' icon={faPlus} text='Thêm sản phẩm' />
        <NavActive to='view-orders' icon={faFolder} text='Xem đơn đặt hàng' />
      </ul>

    </div>
  );
};

export default NavAdmin;