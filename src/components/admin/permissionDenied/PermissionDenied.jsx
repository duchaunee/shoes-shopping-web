import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { NavLink } from 'react-router-dom';

const PermissionDenied = () => {
  return (
    <>
      <div className="m-[50px] h-[50vh]">
        <h1 className='text-[30px] font-[500]'>Quyền truy cập bị từ chối</h1>
        <p className='text-[18px]'>Trang này chỉ có thể truy cập bởi người quản trị</p>

        <div className="mt-5">
          <NavLink
            to='/'
            className='bg-primary text-white px-4 py-3 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
            <FontAwesomeIcon className='mr-[6px]' icon={faLongArrowAltLeft} />
            <span>Quay lại trang chủ</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default PermissionDenied;