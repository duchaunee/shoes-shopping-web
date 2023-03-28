import React from 'react';
import { faInfoCircle, faSignOutAlt, faTools, faTruckMoving } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';
import './headerScroll.scss'

const DropDownAccount = ({ logined, logoutUser, setHoverAccount, admin }) => {
  return (
    <>
      <ul
        className="absolute top-full text-[16px] min-w-[240px] rounded-[3px] bg-white shadow-shadowAccount drop-down-account z-[2] mt-3">
        <li className='hover:text-black transition-all ease-linear duration-100 font-medium text-[#838586] px-5 py-[13px] rounded-[3px]'>
          {
            admin
              ? <NavLink
                onClick={() => setHoverAccount(false)}
                className='flex items-center gap-1'>
                <FontAwesomeIcon
                  icon={faTools}
                  className='cursor-pointer pr-[10px] text-[18px]' />
                <p className='inline-block'>Quản lý người dùng</p>
              </NavLink>
              : <NavLink
                onClick={() => setHoverAccount(false)}
                className='flex items-center gap-1'>
                <FontAwesomeIcon
                  icon={faTruckMoving}
                  className='cursor-pointer pr-[10px] text-[18px]' />
                <p className='inline-block'>Đơn hàng</p>
              </NavLink>
          }
        </li>

        <li className='hover:text-black transition-all ease-linear duration-100 font-medium text-[#838586] px-5 py-[13px] rounded-[3px]'>
          <NavLink
            to="/tai-khoan"
            onClick={() => setHoverAccount(false)}
            className='flex items-center gap-1'>
            <FontAwesomeIcon
              icon={faInfoCircle}
              className='cursor-pointer pr-[10px] text-[18px]' />
            <p className='inline-block'>Thông tin tài khoản</p>
          </NavLink>
        </li>

        <li className='hover:text-black transition-all ease-linear duration-100 font-medium text-[#838586] px-5 py-[13px] rounded-[3px]'>
          <NavLink
            to='/'
            onClick={logoutUser}
            className='flex items-center gap-1'>
            <FontAwesomeIcon
              icon={faSignOutAlt}
              className='cursor-pointer pr-[10px] text-[18px]' />
            <p className='inline-block'>Đăng xuất</p>
          </NavLink>
        </li>
      </ul>
    </>
  );
};

export default DropDownAccount;