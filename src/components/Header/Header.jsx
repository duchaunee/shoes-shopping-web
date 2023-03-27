import React, { memo, useCallback, useEffect, useState } from 'react';
import { faSearch, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nav from './Nav';
import './headerScroll.scss'
import { navData } from './navData';
import DropDownAccount from './DropDownAccount';
import { onAuthStateChanged, signOut, updateEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { REMOVE_ACTIVE_USER, SET_ACTIVE_USER } from '../../redux-toolkit/slice/authSlice';

const Header = ({ logined, setLogined }) => {
  // khi reload lại window, logined bị chạy lại const [logined, setLogined] = useState(false) nên nó sẽ nhấp nháy ở "Đăng nhập/đăng xuất" (logined = false) rồi mới chuyển qua Tài khoản (logined = false), do đó phải khởi tạo lấy giá trị từ localstrogate
  // const [logined, setLogined] = useState(localStorage.getItem('logined') === 'true' ? true : false)
  const [scrolled, setScrolled] = useState(false);
  const [hoverAccount, setHoverAccount] = useState(false)
  const dispatch = useDispatch()

  const logoutUser = () => {
    signOut(auth).then(() => {
      toast.success('Đăng xuất thành công', {
        autoClose: 1200,
      });
      setLogined(false)
      localStorage.setItem('logined', false);
    }).catch((e) => {
      toast.error(e.message, {
        autoClose: 1200,
      });
    });
  }

  useEffect(() => {
    //Nhận diện người dùng đã log in vào hay chưa
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // if (user.emailVerified) {
        //   console.log(user.email);
        //   updateEmail(user, user.email).then(() => {
        //     console.error("Thay đổi email thành công");
        //   }).catch((error) => {
        //     console.error("Thay đổi email thất bại:", error);
        //   });
        // } else {
        //   console.log("Please verify your email address to update your email.");
        // }

        const uid = user.uid;
        setLogined(true)
        setHoverAccount(false)
        localStorage.setItem('logined', true);
        //login bằng gg thì nó có displayname là tên gg, còn login bằng mail thì nó là null, khi đó setusername là tên gmail luôn
        dispatch(
          SET_ACTIVE_USER({
            email: user.email,
            userName: user.displayName || (user.email.slice(0, -10).charAt(0).toUpperCase() + (user.email.slice(0, -10)).slice(1)),
            userID: user.uid,
          })
        )
        //Nhận diện người dùng đã log out hay chưa
      } else {
        dispatch(REMOVE_ACTIVE_USER())
      }
    });
  }, [])

  const handleScroll = useCallback(() => {
    if (window.pageYOffset > 222) {
      setScrolled(true);
    } else if (window.pageYOffset == 0) {
      setScrolled(false);
    }
  });

  useEffect(() => {
    //call luc moi vao web ma man hinh > 200
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <div className={`${scrolled ? "" : "absolute"} z-[1000] h-[133px] w-full`}></div>
      <header className={`${scrolled ? "stuck fixed" : "relative"} z-[1000] h-[133px] w-full text-white/80`}>
        <div className="h-[80px] bg-[#020202]">
          <div className="h-full flex items-center justify-between mx-auto px-[15px] max-w-[1230px]">
            <div>
              {
                logined
                  ? <div
                    onMouseEnter={() => setHoverAccount(true)}
                    onMouseLeave={() => setHoverAccount(false)}
                    className='cursor-pointer text-[13px] py-[10px] font-bold tracking-[0.32px] no-underline  text-white/80 hover:text-white transition-all ease-linear duration-200 relative'>
                    <FontAwesomeIcon icon={faUser} className='cursor-pointer pr-[10px] text-[18px]' />
                    <p className='uppercase inline-block'>Tài khoản</p>
                    {hoverAccount ? <DropDownAccount logined={logined} logoutUser={logoutUser} setHoverAccount={setHoverAccount} /> : ""}
                  </div>
                  : <NavLink
                    to="/dang-nhap"
                    className='text-[13px] cursor-pointer py-[10px] hover:text-white transition-all ease-linear duration-200 font-bold tracking-[0.32px] no-underline uppercase text-white/80' href="">
                    Đăng nhập / Đăng ký
                  </NavLink>
              }

            </div>
            <div className="py-[10px]">
              ShoesPlus LOGO
            </div>
            <div className="flex gap-[15px] items-center">
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className='cursor-pointer py-[10px] text-[18px]' />
              </div>
              <div className="flex gap-[10px] cursor-pointer py-[10px] text-[13px] font-bold items-center no-underline tracking-[0.32px] uppercase hover:text-white transition-all ease-linear duration-200">
                <span className="header-cart-title">
                  Giỏ hàng /
                  <span className="header-cart-price">{logined ? "1,250,000" : "0"} </span>
                  ₫
                </span>
                <span className="text-[22px]">
                  <FontAwesomeIcon icon={faShoppingCart} className='' />
                </span>
              </div>
            </div>
          </div>
        </div >
        <div className="min-h-[25px] w-full bg-[#dcdcdc]">
          <div className="px-[15px] max-w-[1230px] mx-auto">
            <ul className="flex w-full gap-[30px] justify-center">
              {navData.map((nav) => (
                <Nav
                  key={nav.name}
                  name={nav.name}
                  to={nav.to}
                />
              ))}
            </ul>
          </div>
        </div>
      </header >
    </>
  );
};

export default memo(Header);