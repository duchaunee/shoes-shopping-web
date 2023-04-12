import React, { useState } from 'react';
import { faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useSelector } from 'react-redux';
import { selectUserID } from '../../redux-toolkit/slice/authSlice';

const CartProduct = ({ setDeleteDone, idProduct, name, category, img, price, quantityProduct }) => {
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')
  const [quantity, setQuantity] = useState(quantityProduct || 1)
  const navigate = useNavigate()

  const handleDeleteCartProduct = async (idProduct) => {

    const productsRef = query(collection(db, "cartProducts"), where('id', "==", idProduct), where('userID', "==", userID));
    const q = query(productsRef);
    try {
      const querySnapshot = await getDocs(q);
      new Promise((resolve) => {
        const allCartProductsDelete = querySnapshot.docs.map((doc) => doc.id)
        allCartProductsDelete.forEach(async (idItemDelete) => {
          try {
            await deleteDoc(doc(db, "cartProducts", idItemDelete));
          } catch (e) {
            console.log(e.message);
          }
        })
        resolve()
      }).then(() => setDeleteDone(true))
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const solveCategory = (category) => {
    switch (category) {
      case 'giay-nam':
        return 'Giày nam'
      case 'giay-nu':
        return 'Giày nữ'
      case 'giay-tre-em':
        return 'Giày trẻ em'
      default:
        break;
    }
  }

  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  }

  return (
    <>
      <tr
        className='grid items-center gap-5 grid-cols-12 rounded-[4px] py-4 border border-transparent border-b-[#ececec]'>
        <td className='col-span-6 grid grid-cols-7 gap-3 items-center'>
          <div
            onClick={() => {
              console.log('delete');
              handleDeleteCartProduct(idProduct)
            }}
            className="group cursor-pointer hover:border-primary w-[26px] h-[26px] border-[2px] border-[#b8b8b8] rounded-full flex items-center justify-center transition-all ease-in-out duration-100">
            <FontAwesomeIcon className='text-[#b8b8b8] group-hover:text-primary text-[16px] transition-all ease-in-out duration-100' icon={faXmark} />
          </div>
          <img
            onClick={() => navigate(`/san-pham/${idProduct}`)}
            className='col-span-2 rounded-[4px] h-[60px] w-full object-cover cursor-pointer'
            src={img} alt="" />
          <div className="col-span-4 flex flex-col">
            <span
              onClick={() => navigate(`/san-pham/${idProduct}`)}
              className='text-[16] font-medium text-[#334862] cursor-pointer line-clamp-1 '>
              {name}
            </span>
            <span className='text-[#888] line-clamp-2'>{solveCategory(category)}</span>
          </div>
        </td >
        {/* {solvePrice(product.price)} */}
        <td className='col-span-2 flex ' >
          <span className='text-[16px] font-bold'>
            {solvePrice(price)}
            <p className='inline-block text-[16px] align-top ml-[2px]'>₫</p>
          </span>
        </td >
        <td className='col-span-2 flex items-center border border-[#ddd] py-2'>
          <button
            onClick={() => {
              if (quantity > 1) setQuantity(quantity - 1)
            }}
            type='button' className='flex-1 flex items-center  justify-center outline-none text-bgPrimary font-medium '>
            <FontAwesomeIcon className='text-[16px] font-medium' icon={faMinus} />
          </button>
          <div className='flex-1 text-bgPrimary outline-none text-center text-[16px] font-bold' >
            {quantity < 10 ? `0${quantity}` : quantity}
          </div>
          <button
            onClick={() => {
              //chỉ đc set đến max số lượng tồn kho
              setQuantity(quantity + 1)
            }}
            type='button' className='flex-1 flex items-center justify-center outline-none text-bgPrimary font-medium '>
            <FontAwesomeIcon className='text-[16px] font-bold' icon={faPlus} />
          </button>
        </td>
        <td className='col-span-2 flex items-center font-bold'>
          <p className='text-bgPrimary text-center text-[16px]'>{solvePrice(price * quantity)}</p>
          <p className='inline-block text-[16px] align-top ml-[2px]'>₫</p>
        </td>
      </tr>
    </>
  );
};

export default CartProduct; 