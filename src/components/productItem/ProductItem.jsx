import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ButtonPrimary from '../button/ButtonPrimary';
import "../../components/lineClamp.scss"
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../../redux-toolkit/slice/authSlice';

const ProductItem = ({ product, id, img, name, price, text, width, idURL, setLoadingPage }) => {

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const admin = useSelector(selectIsAdmin) || JSON.parse(localStorage.getItem('admin'))


  const detectUser = (functionAdmin, functionUser) => {
    if (admin) return functionAdmin;
    return functionUser
  }

  const handleDetectAdmin = () => {
    //chỉ admi mới cần set showProduct và prevLinkEditProduct
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    localStorage.setItem('showProduct', JSON.stringify(product))
    if (idURL) localStorage.setItem('prevLinkEditProduct', `/${idURL}`)
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
            onClick={() => {
              if (setLoadingPage) setLoadingPage(true) //nguyên nhân có cái này là truyền từ Sản phẩm tương tự trong productDetail, lí do truyền là khi ấn vào, nó sẽ bị nháy ở sp hiện tại (loading car ý nó = false nên nó hiện cái cũ), vậy nên khi ấn vào minh set cho nó là true phát luôn để không bị nháy, THỬ BỎ DÒNG NÀY ĐI CHẠY LÀ THẤY SỰ KHÁC BIỆT
              window.scrollTo({
                top: 0,
                // behavior: 'smooth'
              });
            }}
            to={`/san-pham/${id}`}>
            <img className='pointer-events-none select-none w-full h-full object-cover' src={img} alt="" />
          </NavLink>
        </div>
        <div className="pt-[10px] px-[10px] pb-[20px] flex flex-col justify-center">
          <div className="mb-[10px] text-bgPrimary line-clamp-1 text-center select-none">
            <NavLink
              onClick={() => {
                if (setLoadingPage) setLoadingPage(true) //nguyên nhân có cái này là truyền từ Sản phẩm tương tự trong productDetail, lí do truyền là khi ấn vào, nó sẽ bị nháy ở sp hiện tại (loading car duchauý nó = false nên nó hiện cái cũ), vậy nên khi ấn vào minh set cho nó là true phát luôn để không bị nháy, THỬ BỎ DÒNG NÀY ĐI CHẠY LÀ THẤY SỰ KHÁC BIỆT
                window.scrollTo({
                  top: 0,
                  // behavior: 'smooth'
                });
              }}
              to={`/san-pham/${id}`}>
              {name}
            </NavLink>
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