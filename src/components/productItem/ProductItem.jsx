import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ButtonPrimary from '../button/ButtonPrimary';
import "../../components/lineClamp.scss"
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAdmin } from '../../redux-toolkit/slice/authSlice';
import { ADD_TO_CART, selectCartItems } from '../../redux-toolkit/slice/cartSlice';
import { selectUserID } from '../../redux-toolkit/slice/authSlice';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../firebase/config';

const ProductItem = ({
  setIdxActive, setHoverShowProduct, setTranslateShowX,
  setTranslateX, setHoverSimilarProduct,
  product, id, img, name, price, text, width, idURL, setLoadingPage }) => {

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems) || JSON.parse(localStorage.getItem('cartItems'))
  const admin = useSelector(selectIsAdmin) || JSON.parse(localStorage.getItem('admin'))
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')

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

  const handleAddToCart = async () => {
    setLoading(true)
    setTimeout(() => {
      try {
        const docRef = addDoc(collection(db, "cartProducts"), {
          userID: userID,
          ...product
        });
        setLoading(false)
        dispatch(ADD_TO_CART(product))
      } catch (e) {
        console.log(e.message);
      }
    }, 1000)
  }

  return (
    <>
      {/* w-[280px] */}
      <div
        className={`bg-white ${width ? "" : 'w-full'}`}>
        <div className=''>
          <NavLink
            onMouseDown={(e) => e.preventDefault()}
            onMouseUp={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            className='block h-[150px] touch-none'
            draggable="false"

            onClick={(e) => {
              if (setTranslateX) setTranslateX(0)
              if (setHoverSimilarProduct) setHoverSimilarProduct(false)
              //
              if (setIdxActive) setIdxActive(0)
              if (setHoverShowProduct) setHoverShowProduct(false)
              if (setTranslateShowX) setTranslateShowX(0)
              //
              if (setLoadingPage) setLoadingPage(true) //nguyên nhân có cái này là truyền từ Sản phẩm tương tự trong productDetail, lí do truyền là khi ấn vào, nó sẽ bị nháy ở sp hiện tại (loading car ý nó = false nên nó hiện cái cũ), vậy nên khi ấn vào minh set cho nó là true phát luôn để không bị nháy, THỬ BỎ DÒNG NÀY ĐI CHẠY LÀ THẤY SỰ KHÁC BIỆT
              window.scrollTo({
                top: 0,
                // behavior: 'smooth'
              });
            }}
            to={`/san-pham/${id}`}>
            <img className='w-full h-full object-contain' src={img} alt="" />
          </NavLink>
        </div>
        <div className="pt-[10px] px-[10px] pb-[20px] flex flex-col justify-center">
          <div className="mb-[10px] text-bgPrimary line-clamp-1 text-center">
            <NavLink
              onDragStart={(e) => e.preventDefault()}
              onMouseUp={(e) => e.preventDefault()}
              onClick={() => {
                if (setTranslateX) setTranslateX(0)
                if (setHoverSimilarProduct) setHoverSimilarProduct(false)
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