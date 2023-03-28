import { faFolder, faHome, faMountain, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Admin = () => {
  const [tabActive, setTabActive] = useState(false)

  return (
    <div className='w-full h-full bg-white py-[35px] px-[15px]'>
      <div className="max-w-[1330px] bg-[#fff] mx-auto rounded-[12px] flex shadow-shadowAccount">
        {/* left */}
        <div className="rounded-tl-[12px] rounded-bl-[12px] p-[20px] pt-0 w-[25%] h-full shadow-xl">
          <div className="w-full py-[20px] flex flex-col items-center mb-[20px]">
            <img
              className='w-[100px] h-[100px] rounded-full mb-2'
              src="/adminLogo.png" alt="" />
            <span className='block font-[500] text-center text-bgPrimary text-[22px]'>Admin</span>
          </div>
          <ul className='w-full'>
            <li className='w-full bg-bgPrimary px-6 py-[12px] rounded-[30px] mb-3'>
              <NavLink
                to='admin/home'
                className='flex items-center gap-5'>
                <FontAwesomeIcon className='text-white text-[20px]' icon={faHome} />
                <span className='text-white text-[20px] font-[450]'>Home</span>
              </NavLink>
            </li>

            <li className='w-full px-6 py-[12px] rounded-[30px] mb-3'>
              <NavLink
                to='admin/home'
                className='flex bg-items-center gap-5'>
                <FontAwesomeIcon className='text-bgPrimary text-[24px]' icon={faMountain} />
                <span className='text-bgPrimary text-[20px] font-[450]'>View Products</span>
              </NavLink>
            </li>

            <li className='w-full px-6 py-[12px] rounded-[30px] mb-3'>
              <NavLink
                to='admin/home'
                className='flex items-center gap-5'>
                <FontAwesomeIcon className='text-bgPrimary text-[26px]' icon={faPlus} />
                <span className='text-bgPrimary text-[20px] font-[450]'>Add Product</span>
              </NavLink>
            </li>

            <li className='w-full px-6 py-[12px] rounded-[30px] mb-3'>
              <NavLink
                to='admin/home'
                className='flex items-center gap-5'>
                <FontAwesomeIcon className='text-bgPrimary text-[20px]' icon={faFolder} />
                <span className='text-bgPrimary text-[20px] font-[450]'>View Orders</span>
              </NavLink>
            </li>

          </ul>

        </div>
        {/* ////////////////////////////////////////////////////////////////////////////// */}
        {/* right */}
        <div className="rounded-tr-[12px] rounded-br-[12px] flex-shrink flex-grow px-[25px] pt-[40px] pb-5">
          <div className="w-full h-full bg-[#ccc] ">
            <span className=''>Admin home</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Admin;