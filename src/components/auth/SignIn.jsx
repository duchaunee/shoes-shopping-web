import React from 'react';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router-dom';

const SignIn = ({ signUp }) => {
  // const

  return (
    <>
      <div className={`absolute top-0 transition-all duration-[0.6s] ease-in-out h-full left-0 w-1/2 z-[2] ${signUp ? "translate-x-[100%]" : ""}`}>
        <form className='bg-white flex justify-center flex-col px-[50px] h-full' action="#">
          <h1 className="font-bold m-0 text-[30px] text-center">Đăng nhập</h1>
          <NavLink className="w-full my-3 flex text-white gap-[15px] items-center justify-center cursor-pointer bg-[#dd4b39]">
            <span className="no-underline flex h-[40px] text-[18px] items-center justify-center" href="#" >
              <FontAwesomeIcon className='icon' icon={faGoogle} />
            </span>
            <p>Continue with Google</p>
          </NavLink>
          <span className='text-[13px] mb-3  flex items-center'>
            <div className="flex-grow flex-shrink w-[30px] h-[2px] inline-block bg-[#ccc]"></div>
            <p className='mx-[5px]'>Hoặc đăng nhập bằng tài khoản</p>
            <div className="flex-grow flex-shrink w-[30px] h-[2px] inline-block bg-[#ccc]"></div>
          </span>
          <input className='bg-[#eee] focus:outline-none focus:shadow-shadowPrimary border-none py-3 px-[15px] my-2 w-full' type="email" placeholder="Email" />
          <input className='bg-[#eee] focus:outline-none focus:shadow-shadowPrimary border-none py-3 px-[15px] my-2 w-full' type="password" placeholder="Password" />
          <NavLink
            to='/duchau'
            className=' text-[#333] text-[14px] underline my-[15px]' href="#">
            Quên mật khẩu?
          </NavLink>
          <button className='bg-primary text-white text-[12px] font-bold py-3 px-[45px] tracking-[1px] uppercase transition-transform ease-in delay-[80ms] focus:outline-none'>Đăng nhập</button>
        </form>
      </div>
    </>
  );
};

export default SignIn;