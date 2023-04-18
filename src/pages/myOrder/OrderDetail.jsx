import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useParams } from 'react-router-dom';
import { selectEmail, selectUserName } from '../../redux-toolkit/slice/authSlice';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { OverlayLoading, Skeleton } from '../../animation-loading';

const OrderDetail = () => {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
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
    window.scrollTo({
      top: 0,
    })
    getOrder()
  }, [])

  useEffect(() => {
    console.log('order: ', order);
  }, [order])

  return (
    <>
      <OverlayLoading loading={loading}>
        <div className="w-full py-[30px]">
          <div className="max-w-[1230px] mx-auto ">
            <div className="w-full px-[15px] pb-[30px]">
              <div className="w-full flex">
                <form className='w-full flex'>
                  {/* left */}
                  <div className="basis-[58.33%] pr-[30px] flex flex-col gap-6">
                    <div className="w-full">
                      <h1 className='text-[26px] text-bgPrimary font-bold'>
                        Chi tiết đơn hàng
                      </h1>
                      <div className="">
                        <div className="flex justify-between uppercase font-bold border-[3px] border-transparent border-b-[#ececec]">
                          <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Sản phẩm</h2>
                          <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Tổng</h2>
                        </div>
                        {(order?.cartProducts
                          ? order.cartProducts
                          : Array(3).fill()).map((cartProduct, idx) => (
                            <div
                              key={cartProduct?.id || idx}
                              className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                              <Skeleton loading={loading}>
                                <NavLink
                                  to={`/san-pham/${cartProduct?.id}`}
                                  className='text-[#334862] text-[14px] cursor-pointer flex items-center'>
                                  {cartProduct?.name || 'day la ten de chay skeleton'}
                                  <div className="inline-block mx-1 w-[2px] h-4 bg-[#aaa]"></div>
                                  <p className='text-[#666] inline text-[14px] cursor-pointer'>
                                    {solveCategory(cartProduct?.category) || 'Giày nam'}
                                  </p>
                                  <strong className='text-bgPrimary font-blod ml-1 text-[14px]'>×
                                    {cartProduct?.quantity | '1'}
                                  </strong>
                                </NavLink>
                              </Skeleton >
                              <Skeleton className={`${loading && 'w-[100px]'} inline-block`} loading={loading}>
                                <h2 className='font-bold inline-block text-[14px]'>
                                  {solvePrice(cartProduct?.price) || '9.999.999'} ₫
                                </h2>
                              </Skeleton>
                            </div>
                          ))}
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Tổng phụ</h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className={`${loading && 'w-[100px]'} font-bold inline-block text-[14px]`}>
                              {solvePrice(order?.totalPayment) || '9.999.999'} ₫
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Giao hàng</h2>
                          <Skeleton className={`${loading && 'w-[100px]'} inline-block`} loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {solvePrice(order?.deliveryFee) || '9.999.999'} ₫
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Phương thức thanh toán</h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {order && order?.shippingAddress.paymentMethod
                                ? `${order?.shippingAddress.paymentMethod === "cash"
                                  ? 'Trả tiền mặt khi nhận hàng'
                                  : 'Chuyển khoản ngân hàng'}`
                                : 'Trả tiền mặt khi nhận hàng'}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Tổng cộng</h2>
                          <Skeleton className={`${loading && 'w-[100px]'} inline-block`} loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {`${order && order?.totalPayment + order?.deliveryFee - order?.discount > 0
                                ? solvePrice(order?.totalPayment + order?.deliveryFee - order?.discount)
                                : 0} ₫` || '9.999.999 ₫'}
                            </h2>
                          </Skeleton>
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <h1 className='text-[26px] text-bgPrimary font-bold'>Địa chỉ giao hàng</h1>
                      <div className="">
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Tỉnh / Thành phố
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {(order && order?.shippingAddress.city) || 'Bắc Ninhhhhhhhhhhhhhhhhhhh'}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Quận / Huyện
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {(order && order?.shippingAddress.district) || 'Bắc Ninhhhhhhhhhhhhhhhhhhh'}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Phường / Xã
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {(order && order?.shippingAddress.wards) || 'Bắc Ninhhhhhhhhhhhhhhhhhhh'}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Địa chỉ cụ thể
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {(order && order?.shippingAddress.address) || 'Bắc Ninhhhhhhhhhhhhhhhhhhh'}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Số điện thoại
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {(order && order?.shippingAddress.phoneNumber) || 'Bắc Ninhhhhhhhhhhhhhhhhhhh'}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Ghi chú
                          </h2>
                          <Skeleton className='inline-block' loading={loading}>
                            <h2 className='font-bold inline-block text-[14px]'>
                              {order && order?.shippingAddress.note
                                ? order.shippingAddress.note
                                : <p className={`${loading || 'italic'}`}>Không có ghi chú</p>}
                            </h2>
                          </Skeleton>
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
                        <p className='mr-1'>Thời gian đặt hàng:</p>
                        <Skeleton className='inline-block' loading={loading}>
                          <strong className='text-[16px]'>{(order && `${order?.orderDate} | ${order?.orderTime}`) || '25 tháng 4 năm 2002'}</strong>
                        </Skeleton>
                      </li>
                      <li className='flex mb-3 text-[16px]'>
                        <p className='mr-1'>Tên hiển thị:</p>
                        <Skeleton className='inline-block' loading={loading}>
                          <strong>{(order && order?.displayName) || displayName}</strong>
                        </Skeleton>
                      </li>
                      <li className='flex mb-3 text-[16px]'>
                        <p className='mr-1'>Email:</p>
                        <Skeleton className='inline-block' loading={loading}>
                          <strong>{(order && order?.displayEmail) || displayEmail}</strong>
                        </Skeleton>
                      </li>
                      <li className='flex mb-3 text-[16px]'>
                        <p className='mr-1'>Tổng cộng:</p>
                        <Skeleton className='inline-block' loading={loading}>
                          <strong>
                            {`${order && order?.totalPayment + order?.deliveryFee - order?.discount > 0
                              ? solvePrice(order?.totalPayment + order?.deliveryFee - order?.discount)
                              : 0} ₫` || '9.999.999 ₫'}
                          </strong>
                        </Skeleton>
                      </li>
                      <li className='flex mb-3 text-[16px]'>
                        <p className='mr-1'>Phương thức thanh toán:</p>
                        <Skeleton className='inline-block' loading={loading}>
                          <strong className='font-bold inline-block'>
                            {order && order?.shippingAddress.paymentMethod
                              ? `${order?.shippingAddress.paymentMethod === "cash"
                                ? 'Trả tiền mặt khi nhận hàng'
                                : 'Chuyển khoản ngân hàng'}`
                              : 'Trả tiền mặt khi nhận hàng'}
                          </strong>
                        </Skeleton>
                      </li>
                    </ul>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </OverlayLoading>
    </>
  );
};

export default OrderDetail;