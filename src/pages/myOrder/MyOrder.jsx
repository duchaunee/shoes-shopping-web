import React, { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { selectEmail, selectUserID, selectUserName } from '../../redux-toolkit/slice/authSlice';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';

const MyOrder = () => {
  const [allOrders, setAllOrders] = useState([])
  const displayEmail = useSelector(selectEmail) || localStorage.getItem('displayEmail')
  const displayName = useSelector(selectUserName) || localStorage.getItem('displayName')
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')

  const getOrders = async () => {
    const ordersRef = query(collection(db, "orders"), where('userID', "==", userID));
    const q = query(ordersRef);
    try {
      const querySnapshot = await getDocs(q);
      const allOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      setAllOrders(allOrders)
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

  return (
    <>
      <div className="w-full py-[30px] min-h-[450px]">
        <div className="max-w-[1230px] mx-auto ">
          <div className="w-full px-[15px] pb-[30px]">
            <div className="w-full flex">
              <form className='w-full flex'>
                {/* main */}
                <table className='w-full'>
                  <thead>
                    <tr className='border-[3px] border-transparent border-b-[#ececec] grid gap-10 grid-cols-10 grid-rows-1 text-[14px] font-bold py-2 uppercase tracking-wider'>
                      <td className='col-span-1 text-center'>Đơn hàng</td>
                      <td className='col-span-2'>Ngày</td>
                      <td className='col-span-2'>Tình trạng</td>
                      <td className='col-span-4'>Tổng</td>
                      <td className='col-span-1'>Thao tác</td>
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.map((order, idx) => (
                      <tr
                        key={order.id}
                        className='grid gap-10 grid-cols-10 grid-rows-1 items-center text-[14px] py-4 tracking-wider border border-transparent border-b-[#ececec]'>
                        <td className='col-span-1 text-center text-bgPrimary font-bold'>
                          <NavLink
                            to={`/chi-tiet/${order.id}`}
                            className='text-[#334862]'>
                            #{idx + 1 < 10 ? `0${idx + 1}` : (idx + 1)}
                          </NavLink>
                        </td>
                        <td className='col-span-2 text-[#666]'>{order.orderDate}</td>
                        <td className='col-span-2 text-[#666]'>{order.orderStatus}</td>
                        <td className='col-span-4 text-[#666]'>
                          <p className='text-bgPrimary font-bold inline mr-[6px]'>
                            {order.totalPayment + order.deliveryFee - order.discount > 0
                              ? solvePrice(order.totalPayment + order.deliveryFee - order.discount)
                              : 0} ₫
                          </p>cho {order.orderAmount} mục
                        </td>
                        <td className='col-span-1'>
                          <NavLink
                            to={`/chi-tiet/${order.id}`}
                            className='bg-primary text-white px-4 py-3 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
                            <span className='tracking-wider'>Xem</span>
                          </NavLink>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </form>
            </div>
          </div>
        </div>
      </div >
    </>
  );
};

export default MyOrder;