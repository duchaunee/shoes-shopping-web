import React, { memo, useCallback, useEffect, useState } from 'react';
import { faSearch, faShapes, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nav from './Nav';
import './headerScroll.scss'
import { navData } from './navData';
import DropDownAccount from './DropDownAccount';
import { onAuthStateChanged, signOut, updateEmail } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { toast, ToastContainer } from 'react-toastify';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  REMOVE_ACTIVE_USER,
  SET_ACTIVE_USER,
  selectEmail,
  SET_ACTIVE_ADMIN,
  REMOVE_ACTIVE_ADMIN,
  SET_GOOGLE_USER,
} from '../../redux-toolkit/slice/authSlice';
import Admin from '../admin/Admin';
import { adminAccount } from '../../AdminAccount';

const Header = ({ logined, setLogined, admin, setAdmin, isGoogleUser, setIsGoogleUser }) => {
  // khi reload lại window, logined bị chạy lại const [logined, setLogined] = useState(false) nên nó sẽ nhấp nháy ở "Đăng nhập/đăng xuất" (logined = false) rồi mới chuyển qua Tài khoản (logined = false), do đó phải khởi tạo lấy giá trị từ localstrogate
  // const [logined, setLogined] = useState(localStorage.getItem('logined') === 'true' ? true : false)
  const [scrolled, setScrolled] = useState(false);
  const [hoverAccount, setHoverAccount] = useState(false)
  const dispatch = useDispatch()
  const userEmail = useSelector(selectEmail)

  const logoutUser = () => {
    signOut(auth).then(() => {
      toast.success('Đăng xuất thành công', {
        autoClose: 1200,
      });
      setLogined(false)
      localStorage.setItem('logined', false);

      setAdmin(false)
      localStorage.setItem('admin', false);

      setIsGoogleUser(false)
      localStorage.setItem('isGoogleUser', false);

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
        const uid = user.uid;
        const providerData = user.providerData;
        const isGoogleUser = providerData.some(provider => provider.providerId === 'google.com');

        // Nếu tài khoản đăng nhập là Google
        if (isGoogleUser) {
          localStorage.setItem('isGoogleUser', true);
          dispatch(SET_GOOGLE_USER(true))
          setIsGoogleUser(true)
          console.log('Không thể đổi mật khẩu cho tài khoản đăng nhập bằng Google');
          // xử lý khác (ví dụ hiển thị thông báo lỗi, ẩn form đổi mật khẩu, v.v.)
        }

        setLogined(true)
        setHoverAccount(false)
        localStorage.setItem('logined', true);
        //login bằng gg thì nó có displayname là tên gg, còn login bằng mail thì nó là null, khi đó setusername là tên gmail luôn

        //lưu trên localStorage để xử lí TH mất mạng, phương thức onAuthStateChanged không được gọi vì thế dislayName, displayEmail SẼ BỊ RỖNG (do lúc này dispatch ở dingf 61 không được thực hiện nên nó sẽ lấy giá trị khởi tạo của redux), VẬY NÊN để xử lí thì lưu trên localstrogate
        localStorage.setItem('displayName', user.displayName || (user.email.slice(0, -10).charAt(0).toUpperCase() + (user.email.slice(0, -10)).slice(1)));
        localStorage.setItem('displayEmail', user.email);

        dispatch(
          SET_ACTIVE_USER({
            email: user.email,
            userName: user.displayName || (user.email.slice(0, -10).charAt(0).toUpperCase() + (user.email.slice(0, -10)).slice(1)),
            userID: user.uid,
          })
        )

        if (user.email === adminAccount) {
          //
          dispatch(SET_ACTIVE_ADMIN(true))
          setAdmin(true)
          localStorage.setItem('admin', true);
        }

        // const isGoogleUser = firebase.auth().currentUser.providerData.some((provider) => {
        //   return provider.providerId === "google.com";
        // });

        // if (isGoogleUser) {
        //   console.log("User logged in with Google account");
        // } else {
        //   console.log("User logged in with email and password");
        // }

        //Nhận diện người dùng đã log out hay chưa
      } else {
        console.log('nhan dien logout'); //mat mang thi no tu dong chay vao day luon :v thoi met qua k solve cai nay nua
        localStorage.removeItem('displayName');
        localStorage.removeItem('displayEmail');

        dispatch(REMOVE_ACTIVE_ADMIN())
        dispatch(REMOVE_ACTIVE_USER())
      }
    });

  }, [userEmail]) //khi useSelector(selectEmail) thì redux lúc này vẫn là "" hết, vậy nên khi dispatch thằng email, phải truyền userEmail để dispatch xong re-render nó lại chạy vào thằng useEffect này để check userEmail === adminAccount ?

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
        <div className="h-[80px] bg-bgPrimary">
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
                    {hoverAccount ? <DropDownAccount logined={logined} logoutUser={logoutUser} setHoverAccount={setHoverAccount} admin={admin} /> : ""}
                  </div>
                  : <NavLink
                    to="/dang-nhap"
                    className='text-[13px] cursor-pointer py-[10px] hover:text-white transition-all ease-linear duration-200 font-bold tracking-[0.32px] no-underline uppercase text-white/80' href="">
                    Đăng nhập / Đăng ký
                  </NavLink>
              }

            </div>
            <NavLink
              to="/"
              className="py-[10px] h-full">
              <img className='w-full h-full object-cover' src="/logo.png" alt="" />
            </NavLink>

            {
              admin
                ? <NavLink
                  to='/admin/home'
                  className=" cursor-pointer py-[10px] text-[13px] font-bold items-center no-underline tracking-[0.32px] uppercase hover:text-white transition-all ease-linear duration-200">
                  <FontAwesomeIcon icon={faShapes} className='cursor-pointer pr-[10px] text-[18px]' />
                  Dashboard
                </NavLink>
                : <div className="flex gap-[15px] items-center">
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
            }

          </div>
        </div >
        <div className="min-h-[25px] w-full shadow-shadowAccounts bg-[#d3d3d3]">
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