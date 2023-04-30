import { faMinus, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { db } from '../../../firebase/config';
import { Spinning } from '../../../animation-loading'
import OrderDetailAdmin from './OrderDetailAdmin';
import Pagination from '../../pagination/Pagination';

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

function formatDate(dateString) {
  const arr = dateString.split(/[\s,]+/);
  const filteredArr = arr.filter(item => !isNaN(item));
  return `${filteredArr[0]}/${filteredArr[1].padStart(2, '0')}/${filteredArr[2]}`
}

const itemsPerPage = 6;
const quantity = 3;

const ViewOrders = () => {
  const { id } = useParams()
  const [orderID, setOrderID] = useState('')
  const [orderDetailAdmin, setOrderDetailAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [allOrders, setAllOrders] = useState(true)
  const navigate = useNavigate()
  //
  const [currentPage, setCurrentPage] = useState(1)
  const [pageProducts, setPageProducts] = useState([]); //products every page (use slice to cut all 
  //

  const getOrders = async () => {
    setLoading(true)
    const ordersRef = query(collection(db, "orders"));
    const q = query(ordersRef);
    try {
      const querySnapshot = await getDocs(q);
      const allOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))
      const allOrdersConverted = allOrders
        .sort((orderA, orderB) => (new Date(orderA.creatAt)) - (new Date(orderB.creatAt)))

      localStorage.setItem('orderLengthAdmin', JSON.stringify(allOrders.length))
      setTimeout(() => {
        setLoading(false)
        setAllOrders(allOrdersConverted)
        setPageProducts(allOrdersConverted.slice(0, itemsPerPage))
      }, 500)
    }
    catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  useEffect(() => {
    if (id === 'view') {
      setOrderDetailAdmin(false)
      getOrders()
    }
    else setOrderDetailAdmin(true)
  }, [id])

  return (
    <>
      {!orderDetailAdmin
        ? (
          <div className="">
            <div className="h-full">
              <div className="w-full shadow-shadowPrimary px-3 rounded-md">
                <table className='w-full'>
                  <thead>
                    <tr className={`${!loading && allOrders.length > 0 && 'border-[3px] border-transparent border-b-[#ececec]'} grid grid-cols-14 gap-2 grid-rows-1 text-[14px] font-bold py-4 uppercase tracking-wider`}>
                      <td className='col-span-3'>Họ tên</td>
                      <td className='col-span-3'>Địa chỉ</td>
                      <td className='col-span-2'>SĐT</td>
                      <td className='col-span-2'>Ngày đặt</td>
                      <td className='col-span-2'>Tình trạng</td>
                      <td className='col-span-2'>Hành động</td>
                    </tr>
                  </thead>
                  <tbody style={{
                    height: `${loading ? '0' : itemsPerPage * 70 + 20}px`
                  }}>
                    {!loading
                      && (
                        pageProducts.map((order) => (
                          <tr
                            key={order.id}
                            className='grid items-center grid-cols-14 gap-2 rounded-[4px] h-[70px] border border-transparent border-b-[#ececec]'>
                            <td className='col-span-3 grid grid-cols-7 gap-3 items-center'>
                              <p className="col-span-7 flex flex-col line-clamp-2">
                                {order.displayName}
                              </p>
                            </td >
                            <td className='col-span-3 flex ' >
                              <span className='text-[16px] line-clamp-2'>{order.shippingAddress.address}</span>
                            </td >
                            <td className='col-span-2 flex items-center py-2'>
                              <p className="">{order.shippingAddress.phoneNumber}</p>
                            </td>
                            <td className='col-span-2 flex items-center py-2'>
                              <p className="">{formatDate(order.orderDate)}</p>
                            </td>
                            <td className='col-span-2 flex items-center font-bold'>
                              <p className='text-bgPrimary text-center text-[16px]'>{order.orderStatus}</p>
                            </td>
                            <td className='col-span-2 flex items-center font-bold'>
                              <button
                                onClick={(e) => {
                                  setOrderID(order.id)
                                  setOrderDetailAdmin(true)
                                  navigate(`/admin/view-orders/${order.id}`)
                                }}
                                className='bg-primary text-white px-2 py-1 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
                                <span className='tracking-wider uppercase text-[14px] font-medium'>Xem chi tiết</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                  </tbody>
                </table>
              </div>
              {loading && (
                <div className="w-full h-[350px]">
                  <Spinning color='#1f2028' size='30px' />
                </div>
              )}
              {!loading && allOrders.length === 0 && (
                <div className="w-full h-full flex flex-col gap-8 items-center justify-center mt-[-24px]">
                  <div
                    style={{
                      backgroundImage: "url('/emptyOrder.jpg')"
                    }}
                    className="w-[320px] h-[200px] bg-cover bg-no-repeat bg-center"></div>
                  <div className='text-center text-[20px] font-bold text-bgPrimary font-mono leading-[32px] uppercase'>Chưa có đơn hàng nào được tạo ra
                  </div>
                </div>
              )}
            </div>
            {!loading && (
              <div className="">
                <Pagination
                  products={allOrders}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  quantity={quantity}
                  setPageProducts={setPageProducts} />
              </div>
            )}
          </div>
        )
        : <>
          {/* lí do phải || id là orderID chỉ được set khi click vào sp, vậy khi click rồi, vào đc OrderDetailAdmin rồi mà nhấn refresh thì orderID nó là '', vậy nên phải || id (vì id lúc này là cái path phía sau view-order/kjas2pIeRvlnvkGAHpjX) */}
          <OrderDetailAdmin id={orderID || id} />
        </>}
    </>
  );
};

export default ViewOrders;