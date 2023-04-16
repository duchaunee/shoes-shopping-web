import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { selectEmail, selectUserName } from '../../redux-toolkit/slice/authSlice';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState([])
  const [loading, setLoading] = useState(true)
  const displayEmail = useSelector(selectEmail) || localStorage.getItem('displayEmail')
  const displayName = useSelector(selectUserName) || localStorage.getItem('displayName')

  const getOrder = async () => {
    setLoading(true)
    const docRef = doc(db, "orders", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      setOrder({
        id: id,
        ...docSnap.data()
      })
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } else {
      // docSnap.data() will be undefined in this case
      // console.log("No such document!");
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

  useEffect(() => {
    getOrder()
  }, [])

  useEffect(() => {
    console.log(order.cartProducts);
  }, [order])

  return (
    <>
      {!loading && (
        <div className="w-full py-[30px]">
          <div className="max-w-[1230px] mx-auto ">
            <div className="w-full px-[15px] pb-[30px]">
              <div className="w-full flex">
                <form className='w-full flex'>
                  {/* left */}
                  <div className="basis-[58.33%] pr-[30px] flex flex-col gap-6">
                    <div className="w-full">
                      <h1 className='text-[26px] text-bgPrimary font-bold'>Chi tiết đơn hàng</h1>
                      <div className="">
                        <div className="flex justify-between uppercase font-bold border-[3px] border-transparent border-b-[#ececec]">
                          <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Sản phẩm</h2>
                          <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Tổng</h2>
                        </div>
                        {order?.cartProducts.map((cartProduct) => (
                          <div
                            key={cartProduct.id}
                            className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                            <NavLink
                              // to={`/san-pham/${cartProduct.id}`}
                              className='text-[#334862] text-[14px] cursor-pointer flex items-center'>
                              {cartProduct.name}
                              <div className="inline-block mx-1 w-[2px] h-4 bg-[#aaa]"></div>
                              <p className='text-[#666] inline text-[14px] cursor-pointer'>
                                {solveCategory(cartProduct.category)}
                              </p>
                              <strong className='text-bgPrimary font-blod ml-1 text-[14px]'>×
                                {cartProduct.quantity}
                              </strong>
                            </NavLink>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {solvePrice(cartProduct.price)} ₫
                            </h2>
                          </div>
                        ))}
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Tổng phụ</h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            {solvePrice(order.totalPayment)} ₫
                          </h2>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Giao hàng</h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            {solvePrice(order.deliveryFee)} ₫
                          </h2>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Phương thức thanh toán</h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            {order.shippingAddress.paymentMethod === "cash"
                              ? 'Trả tiền mặt khi nhận hàng'
                              : 'Chuyển khoản ngân hàng'}
                          </h2>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Tổng cộng</h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            {order.totalPayment + order.deliveryFee - order.discount > 0
                              ? solvePrice(order.totalPayment + order.deliveryFee - order.discount)
                              : 0} ₫
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <h1 className='text-[26px] text-bgPrimary font-bold'>Địa chỉ giao hàng</h1>
                      <div className="">
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Tỉnh / Thành phố
                          </h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            {order.shippingAddress.city}
                          </h2>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Quận / Huyện
                          </h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            {order.shippingAddress.district}
                          </h2>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Phường / Xã
                          </h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            {order.shippingAddress.wards}
                          </h2>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Địa chỉ cụ thể
                          </h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            {order.shippingAddress.address}
                          </h2>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Số điện thoại
                          </h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            {order.shippingAddress.phoneNumber}
                          </h2>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Ghi chú
                          </h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            {order.shippingAddress.note
                              ? order.shippingAddress.note
                              : <p className='italic'>Không có ghi chú</p>}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* right */}
                  <div className='self-start flex-1 py-6 bg-[#fafafa] shadow-md px-[30px] border-[2px] border-solid'>
                    <strong className='text-[#7a9c59] font-bold block mb-5 uppercase'>
                      Thông tin đặt hàng
                    </strong>
                    <ul className=''>
                      <li className='flex mb-3'>
                        <p className='mr-1'>Ngày:</p>
                        <strong>{order.orderDate}</strong>
                      </li>
                      <li className='flex mb-3'>
                        <p className='mr-1'>Tên hiển thị:</p>
                        <strong>{order.displayName || displayName}</strong>
                      </li>
                      <li className='flex mb-3'>
                        <p className='mr-1'>Email:</p>
                        <strong>{order.displayEmail || displayEmail}</strong>
                      </li>
                      <li className='flex mb-3'>
                        <p className='mr-1'>Tổng cộng:</p>
                        <strong>
                          {order.totalPayment + order.deliveryFee - order.discount > 0
                            ? solvePrice(order.totalPayment + order.deliveryFee - order.discount)
                            : 0} ₫
                        </strong>
                      </li>
                      <li className='flex mb-3'>
                        <p className='mr-1'>Phương thức thanh toán:</p>
                        <strong>
                          {order.shippingAddress.paymentMethod === "cash"
                            ? 'Trả tiền mặt khi nhận hàng'
                            : 'Chuyển khoản ngân hàng'}
                        </strong>
                      </li>
                    </ul>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div >
      )}
    </>
  );
};

export default OrderDetail;