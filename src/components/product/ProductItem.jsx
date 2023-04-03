import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Spinning } from '../../animation-loading';
import ButtonPrimary from '../button/ButtonPrimary';
import "../../components/lineClamp.scss"

const ProductItem = ({ img, name, price, text, width }) => {
  const [loading, setLoading] = useState(false)

  const handleAddToCart = useCallback(() => {
    setLoading(true);
  })

  //load 1,2s roi moi them vao gio hang, neu ve sau co dung tren firebase thi k can cai nay vi tai tren firebase can tgian
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200)
    return () => {
      clearTimeout(timer)
    }
  }, [loading])

  return (
    <>
      {/* w-[280px] */}
      <div
        className={`bg-white ${width}`}>
        <div className=''>
          <NavLink
            className='min-h-[130px]'
            to="/">
            <img src={img} alt="" />
          </NavLink>
        </div>
        <div className="pt-[10px] px-[10px] pb-[20px]">
          <div className="w-full text-center mb-[10px] text-[#334862] line-clamp-1">
            <NavLink to='/'>{name}</NavLink>
          </div>
          <div className="w-full text-primary font-bold text-center">
            {price} <p className='inline'>₫</p>
          </div>
          <div className='text-center'>
            <ButtonPrimary
              loading={loading}
              onClick={handleAddToCart}
              text={text} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductItem;