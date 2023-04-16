import React, { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { selectEmail, selectUserID, selectUserName } from '../../redux-toolkit/slice/authSlice';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { OverlayLoading, Skeleton } from '../../animation-loading';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const MyOrder = () => {
  const [loading, setLoading] = useState(true)
  const [allOrders, setAllOrders] = useState([])
  const displayEmail = useSelector(selectEmail) || localStorage.getItem('displayEmail')
  const displayName = useSelector(selectUserName) || localStorage.getItem('displayName')
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')

  const getOrders = async () => {
    setLoading(true)
    const ordersRef = query(collection(db, "orders"), where('userID', "==", userID));
    const q = query(ordersRef);
    try {
      const querySnapshot = await getDocs(q);
      const allOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      localStorage.setItem('orderLength', JSON.stringify(allOrders.length))
      setTimeout(() => {
        setLoading(false)
        setAllOrders(allOrders)
      }, 1000)
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

  useEffect(() => {
    getOrders()
  }, [])

  useEffect(() => {
    console.log(allOrders.length);
    console.log(JSON.parse(localStorage.getItem('orderLength')));
  }, [allOrders])

  return (
    <>
      <OverlayLoading loading={loading}>
        <div className="w-full py-[30px] min-h-[600px]">
          <div className="max-w-[1230px] mx-auto ">
            <div className="w-full px-[15px] pb-[30px]">
              <div className="w-full flex">
                <form className='w-full flex'>
                  {/* main */}
                  {(allOrders.length === 0 || JSON.parse(localStorage.getItem('orderLength')) === 0) && !loading
                    ? (
                      <div className="w-full h-[480px] flex flex-col gap-8 items-center justify-center">
                        {/* <img className='w-full h-[300px] object-contain' src="../../emptyCart.png" alt="" /> */}
                        <div
                          style={{
                            backgroundImage: "url('/emptyOrder.jpg')"
                          }}
                          className="w-[420px] h-[500px] bg-cover bg-no-repeat bg-center"></div>
                        <div className='text-center text-[28px] font-bold text-bgPrimary font-mono leading-[32px] uppercase'>Chưa có đơn hàng nào được tạo ra
                          <p className='font-mono font-normal text-[24px] text-center'>Vui lòng quay lại trang chủ để tìm sản phẩm phù hợp và đặt hàng</p>
                        </div>
                        <NavLink
                          to='/'
                          className='bg-primary text-white px-4 py-3 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
                          <FontAwesomeIcon className='mr-[6px]' icon={faLongArrowAltLeft} />
                          <span className='text-[20px]'>Quay lại trang chủ</span>
                        </NavLink>
                      </div>
                    )
                    : (
                      <div className='w-full'>
                        <div>
                          <div className='border-[3px] border-transparent border-b-[#ececec] grid gap-10 grid-cols-10 grid-rows-1 text-[14px] font-bold py-2 uppercase tracking-wider'>
                            <div className='col-span-1 text-center'>Đơn hàng</div>
                            <div className='col-span-2'>Ngày</div>
                            <div className='col-span-2'>Tình trạng</div>
                            <div className='col-span-4'>Tổng</div>
                            <div className='col-span-1'>Thao tác</div>
                          </div>
                        </div>
                        <div>
                          {(allOrders.length === 0
                            ? Array(3).fill()
                            : allOrders).map((order, idx) => (
                              <div
                                key={order?.id || idx}
                                className='grid gap-10 grid-cols-10 grid-rows-1 items-center text-[14px] py-4 tracking-wider border border-transparent border-b-[#ececec]'>
                                <Skeleton loading={loading}>
                                  <div className='col-span-1 text-center text-bgPrimary font-bold'>
                                    <NavLink
                                      to={`/chi-tiet/${order?.id}`}
                                      className='text-[#334862]'>
                                      #{idx + 1 < 10 ? `0${idx + 1}` : (idx + 1)}
                                    </NavLink>
                                  </div>
                                </Skeleton>
                                <Skeleton className='col-span-2' loading={loading}>
                                  <div className='col-span-2 text-[#666]'>{order?.orderDate || 'text de chay skeleton'}</div>
                                </Skeleton>
                                <Skeleton className='col-span-2' loading={loading}>
                                  <div className='col-span-2 text-[#666]'>{order?.orderStatus || 'text de chay skeleton'}</div>
                                </Skeleton>
                                <Skeleton className='col-span-4 w-1/2' loading={loading}>
                                  <div className='col-span-4 text-[#666]'>
                                    <p className='text-bgPrimary font-bold inline mr-[6px]'>
                                      {order?.totalPayment + order?.deliveryFee - order?.discount > 0
                                        ? solvePrice(order?.totalPayment + order?.deliveryFee - order?.discount)
                                        : 0} ₫
                                    </p>cho {order?.orderAmount} mục
                                  </div>
                                </Skeleton>
                                <div className='col-span-1'>
                                  <NavLink
                                    to={`/chi-tiet/${order?.id}`}
                                    className='bg-primary text-white px-4 py-3 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
                                    <span className='tracking-wider'>Xem</span>
                                  </NavLink>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                </form>
              </div>
            </div>
          </div>
        </div >
      </OverlayLoading>
    </>
  );
};

export default MyOrder;