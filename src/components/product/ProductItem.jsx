import React, { useCallback, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Spinning } from '../../animation-loading';
import ButtonPrimary from '../button/ButtonPrimary';

const ProductItem = ({ img, name, price, text }) => {
  const [loading, setLoading] = useState(false)

  const handleAddToCart = useCallback(() => {
    setLoading(true);
  })

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
      <div
        // h-[394.299px]
        className="w-[280px] bg-white">
        <div className=''>
          <NavLink to="/">
            <img src="http://mauweb.monamedia.net/converse/wp-content/uploads/2019/05/sale-off-6.jpg" alt="" />
          </NavLink>
        </div>
        <div className="pt-[10px] px-[10px] pb-[20px]">
          <div className="w-full text-center mb-[10px] text-[#334862]">
            <NavLink to='/'>Chuck Taylor Classic</NavLink>
          </div>
          <div className="w-full text-primary font-bold text-center">
            1,250,000 <p className='inline'>₫</p>
          </div>
          <div className='text-center'>
            <ButtonPrimary
              loading={loading}
              onClick={handleAddToCart}
              text={'Add to cart'} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductItem;