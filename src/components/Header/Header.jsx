import React, { useCallback, useEffect, useState } from 'react';
import { faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Nav from './Nav';
import './headerScroll.css'
import { navData } from './navData';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);

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
      <div className={`${scrolled ? "" : "absolute"} h-[133px] w-full`}></div>
      <header className={`${scrolled ? "stuck fixed" : "relative"} h-[133px] w-full text-white/80`}>
        <div className="h-[80px] bg-[#020202]">
          <div className="h-full flex items-center justify-between mx-auto px-[15px] max-w-[1230px]">
            <div>
              <a className='text-[13px] py-[10px] font-bold tracking-[0.32px] no-underline uppercase text-white/80' href="">Đăng nhập / Đăng ký</a>
            </div>
            <div className="py-[10px]">
              DUCHAU LOGO
            </div>
            <div className="flex gap-[15px] items-center">
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className='cursor-pointer py-[10px] text-[18px]' />
              </div>
              <div className="flex gap-[10px] cursor-pointer py-[10px] text-[13px] font-bold items-center no-underline tracking-[0.32px] uppercase">
                <span className="header-cart-title">
                  Giỏ hàng /
                  <span className="header-cart-price">1,250,000</span>
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

export default Header;