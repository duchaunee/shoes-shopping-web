import React, { useState } from 'react';
import { faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';

const CartProduct = ({ idProduct, name, img, price, quantityProduct }) => {
  const [quantity, setQuantity] = useState(quantityProduct || 1)
  const navigate = useNavigate()
  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  }

  return (
    <>
      <tr
        className='grid items-center gap-5 grid-cols-12 rounded-[4px] py-4 border border-transparent border-b-[#ececec]'>
        <td className='col-span-6 grid grid-cols-7 gap-3 items-center'>
          <div className="group cursor-pointer hover:border-bgPrimary w-[26px] h-[26px] border-[2px] border-[#b8b8b8] rounded-full flex items-center justify-center transition-all ease-in-out duration-100">
            <FontAwesomeIcon className='text-[#b8b8b8] group-hover:text-bgPrimary text-[16px] transition-all ease-in-out duration-100' icon={faXmark} />
          </div>
          <img
            onClick={() => navigate(`/san-pham/${idProduct}`)}
            className='col-span-2 rounded-[4px] h-[60px] w-full object-cover cursor-pointer'
            src={img} alt="" />
          <div className="col-span-4 flex flex-col items-center">
            <span
              onClick={() => navigate(`/san-pham/${idProduct}`)}
              className='text-[14px] font-medium text-[#334862] cursor-pointer line-clamp-1 '>
              {name}
            </span>
          </div>
        </td >
        {/* {solvePrice(product.price)} */}
        <td className='col-span-2 flex ' >
          <span className='text-[14px] font-bold'>
            {solvePrice(price)}
            <p className='inline-block text-[14px] align-top ml-[2px]'>₫</p>
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
          <div className='flex-1 text-bgPrimary outline-none text-center text-[14px] font-bold' >
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
          <p className='text-bgPrimary text-center text-[14px]'>{solvePrice(price * quantity)}</p>
          <p className='inline-block text-[14px] align-top ml-[2px]'>₫</p>
        </td>
      </tr>
    </>
  );
};

export default CartProduct; 