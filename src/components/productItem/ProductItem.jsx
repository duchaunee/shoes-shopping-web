import React, { useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Spinning } from '../../animation-loading';
import ButtonPrimary from '../button/ButtonPrimary';
import "../../components/lineClamp.scss"
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../../redux-toolkit/slice/authSlice';

const ProductItem = ({ product, id, img, name, price, text, width, idURL }) => {

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const admin = useSelector(selectIsAdmin) || JSON.parse(localStorage.getItem('admin'))


  const detectUser = (functionAdmin, functionUser) => {
    if (admin) return functionAdmin;
    return functionUser
  }

  const handleDetectAdmin = () => {
    //chỉ admi mới cần set showProduct và prevLinkEditProduct
    localStorage.setItem('showProduct', JSON.stringify(product))
    localStorage.setItem('prevLinkEditProduct', `/${idURL}`)
    navigate(`/admin/add-product/${id}`)
  }

  const handleAddToCart = () => {
    setLoading(true);
  }

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
        className={`bg-white ${width ? "" : 'w-full'}`}>
        <div className=''>
          <NavLink
            className='block h-[150px]'
            to={`/san-pham/${id}`}>
            <img className='w-full h-full object-cover' src={img} alt="" />
          </NavLink>
        </div>
        <div className="pt-[10px] px-[10px] pb-[20px] flex flex-col justify-center">
          <div className="mb-[10px] text-bgPrimary line-clamp-1 text-center">
            <NavLink to={`/san-pham/${id}`}>{name}</NavLink>
          </div>
          <div className=" text-bgPrimary font-bold flex justify-center">
            {price}
            <p className='inline-block text-[14px] align-top ml-[2px]'>₫</p>
          </div>
          <div className=''>
            <ButtonPrimary
              loading={loading}
              onClick={() => {
                detectUser(handleDetectAdmin, handleAddToCart)()
              }}
              text={text} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductItem;