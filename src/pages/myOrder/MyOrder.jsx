import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { selectEmail, selectUserID, selectUserName } from '../../redux-toolkit/slice/authSlice';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { OverlayLoading, Skeleton } from '../../animation-loading';
import { faLongArrowAltLeft, faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


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

const solveBrand = (brand) => {
  switch (brand) {
    case 'classic':
      return 'Classic'
    case 'sunbaked':
      return 'Sunbaked'
    case 'chuck-07s':
      return 'Chuck 07S'
    case 'one-star':
      return 'One Star'
    case 'psy-kicks':
      return 'PSY Kicks'
    default:
      break;
  }
}

const solvePrice = (price) => {
  return Number(price).toLocaleString('vi-VN');
}

const MyOrder = () => {
  const [loading, setLoading] = useState(true)
  const [allOrders, setAllOrders] = useState([])
  const [allReviews, setAllReviews] = useState(new Map())
  const displayEmail = useSelector(selectEmail) || localStorage.getItem('displayEmail')
  const displayName = useSelector(selectUserName) || localStorage.getItem('displayName')
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')
  //
  let countProducts = 0;
  const [activeStatus, setActiveStatus] = useState('Tất cả')

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
      const allOrdersConverted = allOrders
        .sort((orderA, orderB) => (new Date(orderA.creatAt)) - (new Date(orderB.creatAt)))

      localStorage.setItem('orderLength', JSON.stringify(allOrders.length))
      setTimeout(() => {
        setLoading(false)
        setAllOrders(allOrdersConverted)
      }, 500)
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const getReviews = async () => {
    const mapReviews = new Map()
    const reviewsRef = query(collection(db, "reviews"),
      where('userID', "==", userID));
    const q = query(reviewsRef);
    try {
      const querySnapshot = await getDocs(q);
      const allReviews = querySnapshot.docs.map((doc) => {
        mapReviews.set(doc.data().productID, doc.data())
      })
      setAllReviews(mapReviews)
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const filderProductsDelivery = () => {

  }

  useEffect(() => {
    getOrders()
    getReviews()
  }, [])

  // useEffect(() => {
  //   console.log(allOrders.length);
  //   console.log(JSON.parse(localStorage.getItem('orderLength')));
  // }, [allOrders])

  return (
    <>
      <OverlayLoading loading={loading}>
        <div className={`w-full py-[30px] min-h-[800px] bg-white ${loading && 'blur-[2px]'}`}>
          <div className="max-w-[1230px] mx-auto ">
            <div className="w-full px-[15px] pb-[30px]">
              <div className='w-full'>
                {(allOrders.length === 0 || JSON.parse(localStorage.getItem('orderLength')) === 0) && !loading
                  ? (
                    <div className="w-full h-[480px] flex flex-col gap-8 items-center justify-center">
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
                    <>
                      {/* nav */}
                      <div className="w-full grid grid-cols-5 grid-rows-1 item shadow-shadowPrimary mb-5">
                        {['Tất cả', 'Đang xử lý', 'Vận chuyển', 'Đang giao', 'Hoàn thành']
                          .map(item => (
                            <button
                              key={item}
                              onClick={() => setActiveStatus(item)}
                              value={item}
                              className={`${activeStatus === item && 'border-b-primary text-primary'} text-center text-bgPrimary cursor-pointer transition-all ease-in-out duration-150 border-[2px] border-transparent hover:text-primary font-medium py-3`}>{item.toUpperCase()}</button>
                          ))}
                      </div>
                      {/* products */}
                      {allOrders.map((order, idx) => {
                        countProducts++;
                        if (countProducts === order.orderAmount && idx < allOrders.length - 1) {
                          countProducts = 0;
                          return (
                            <div className='w-full' key={order.id} >
                              <OrderProduct order={order} allReviews={allReviews} />
                              <div style={{
                                height: '.1875rem',
                                width: '100%',
                                marginBottom: '16px',
                                backgroundPositionX: '-1.875rem',
                                backgroundSize: '7.25rem .1875rem',
                                backgroundImage: 'repeating-linear-gradient(45deg,#6fa6d6,#6fa6d6 33px,transparent 0,transparent 41px,#f18d9b 0,#f18d9b 74px,transparent 0,transparent 82px)',
                              }}></div>
                            </div>
                          )
                        }
                        else return (
                          <OrderProduct key={order.id} order={order} allReviews={allReviews} />
                        )
                      })}
                    </>
                  )}

                {/* {(allOrders.length === 0 || JSON.parse(localStorage.getItem('orderLength')) === 0) && !loading
                    ? (
                      <div className="w-full h-[480px] flex flex-col gap-8 items-center justify-center">
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
                            <div className='col-span-2'>Thời gian đặt hàng</div>
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
                                  <div className='col-span-2 text-[#666]'>
                                    {`${order?.orderDate} | ${order?.orderTime}` || 'text de chay skeleton'}
                                  </div>
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
                    )} */}
              </div>
            </div>
          </div>
        </div >
      </OverlayLoading>
    </>
  );
};

const OrderProduct = ({ order, allReviews }) => (
  <div className="w-full p-6 pt-3 mb-4 shadow-shadowPrimary">
    {/* top */}
    <div className=" pb-3 border border-transparent border-b-[#ddd] flex justify-between items-center">
      <div className="text-bgPrimary font-bold text-[14px] uppercase ">
        <p className="inline-block text-primary mr-1">Ngày đặt hàng:</p>
        <p className='inline-block'>{`${order.orderDate} | ${order.orderTime}`}</p>
      </div>
      <div className='flex gap-4 items-center'>
        {allReviews.has(order.cartProduct.id) && (
          <p className="text-primary uppercase text-[14px] tracking-wider">Đã đánh giá</p>
        )}
        <NavLink
          to={`/chi-tiet/${order?.id}`}
          className='bg-primary text-white px-4 py-1 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
          <span className='tracking-wider uppercase text-[14px] font-medium'>Xem đơn hàng</span>
        </NavLink>
      </div>
    </div>
    {/* bottom */}
    <div className="w-full flex items-center justify-between pt-4">
      <div className="flex">
        <NavLink
          to={`/san-pham/${order.cartProduct.id}`}
          className=''>
          <img className="h-[80px] object-cover"
            src={order.cartProduct.imgURL} alt="" />
        </NavLink>
        <div className="pl-4">
          <div className="">
            <NavLink
              to={`/san-pham/${order.cartProduct.id}`}
              className='text-[#334862]'>
              {order.cartProduct.name}
            </NavLink>
            <p className='inline-block ml-1'> ×{order.cartProduct.quantity}</p>
          </div>
          <div className="text-[14px] text-[#777]">
            <p className="mr-1 inline-block">Phân loại hàng:</p>
            {`${solveCategory(order.cartProduct.category)} | ${solveBrand(order.cartProduct.brand)}`}
          </div>
          <div className="text-primary px-1 text-[12px] border border-primary inline-block">7 ngày trả hàng</div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex gap-2 items-center">
          <p className="inline-block line-through text-[#aaa]">
            {solvePrice(order.cartProduct.price * 2)} ₫
          </p>
          <p className="inline-block font-semibold  text-bgPrimary">
            {solvePrice(order.cartProduct.price)} ₫
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FontAwesomeIcon className='text-[20px]' icon={faMoneyCheckDollar} />
          <div className="font-medium">Thành tiền:
            <p className="text-primary font-medium inline-block ml-1">
              {solvePrice((order.cartProduct.price - (order.discount - order.deliveryFee)).toFixed(3))} ₫
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default MyOrder;