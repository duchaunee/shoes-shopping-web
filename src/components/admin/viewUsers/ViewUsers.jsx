import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase/config';
import Pagination from '../../pagination/Pagination';
import { Spinning } from '../../../animation-loading';
import { adminAccount } from '../../../AdminAccount';

const itemsPerPage = 6;
const quantity = 3;

const ViewUsers = () => {
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState(null);
  const [allUsersSort, setAllUsersSort] = useState(null);
  //
  const [currentPage, setCurrentPage] = useState(1)
  const [pageProducts, setPageProducts] = useState([]); //products every page (use slice to cut all 
  //

  const getUsers = async () => {
    setLoading(true)
    const ordersRef = query(collection(db, "users"));
    const q = query(ordersRef);
    try {
      const querySnapshot = await getDocs(q);
      const allUsers = querySnapshot.docs.map((doc) => {
        if (doc.data().displayEmail !== adminAccount) {
          return ({
            id: doc.id,
            ...doc.data()
          })
        }
      }).filter(user => user)
      const allUserWithOrder = await Promise.all(allUsers.map(async (user) => {
        const ordersRef = query(collection(db, "orders"), where('userID', "==", user.userID));
        const q = query(ordersRef);
        try {
          const querySnapshot = await getDocs(q);
          const order = querySnapshot.docs.map((doc) => ({ ...doc.data() }))
          return ({
            ...user,
            orderQuantity: order.length
          })
        }
        catch (e) {
          console.log(e.message);
        }
      }))
      // localStorage.setItem('orderLength', JSON.stringify(allOrders.length))
      setTimeout(() => {
        setLoading(false)
        setAllUsers(allUserWithOrder)
        setAllUsersSort(allUserWithOrder)
        setPageProducts(allUserWithOrder.slice(0, itemsPerPage))
      }, 1000)
    }
    catch (e) {
      console.log(e.message);
    }
  }

  useEffect(() => {
    getUsers()
  }, []);

  return (
    <>
      <div className="">
        <div className="h-full">
          {/* <div className="flex gap-4 mb-4 w-full items-center justify-end">
            <div className='text-bgPrimary text-[16px] flex items-center'>
              <p className='font-bold inline-block text-[16px]'>Số lượng</p>
              : {notFound ? "0" : allOrdersSort.length} đơn hàng
            </div>
            <div className="">
              <select
                ref={filterRef}
                onChange={handleFilterOrder}
                className='outline-none bg-slate-100 px-3 py-2 text-bgPrimary cursor-pointer border border-solid border-[#ddd] inline-block'
                name="sort-by" id="">
                <option key='0' value="default">Lọc đơn hàng theo</option>
                <option key='1' value="all">Tất cả</option>
                <option key='2' value="Đang xử lý">Đang xử lý</option>
                <option key='3' value="Vận chuyển">Vận chuyển</option>
                <option key='4' value="Đang giao">Đang giao</option>
                <option key='5' value="Hoàn thành">Hoàn thành</option>
                <option key='6' value="Đã hủy">Đã hủy</option>
              </select>
            </div>
            <div className="">
              <select
                ref={queryRef}
                onChange={handleQueryOrder}
                className='outline-none bg-slate-100 px-3 py-2 text-bgPrimary cursor-pointer border border-solid border-[#ddd] shadow-shadowSearch'
                name="sort-by" id="">
                <option key='0' value="default">Sắp xếp đơn hàng theo</option>
                <option key='1' value="latest">Mới nhất</option>
                <option key='2' value="oldest">Cũ nhất</option>
              </select>
            </div>
          </div> */}
          <div className="w-full shadow-shadowPrimary px-3 rounded-md">
            <table className='w-full'>
              <thead>
                <tr className={`${!loading && allUsersSort.length > 0 && 'border-[3px] border-transparent border-b-[#ececec]'} grid grid-cols-12 gap-2 grid-rows-1 text-[14px] font-bold py-4 uppercase tracking-wider`}>
                  <td className='col-span-2 flex justify-center'>Ảnh hiển thị</td>
                  <td className='col-span-3'>Họ tên khách hàng</td>
                  <td className='col-span-3'>Địa chỉ email</td>
                  <td className='col-span-2 flex justify-center'>Số đơn hàng</td>
                  <td className='col-span-2 flex justify-center'>Hành động</td>
                </tr>
              </thead>
              <tbody style={{
                height: `${loading ? '0' : itemsPerPage * 70 + 20}px`
              }}>
                {!loading
                  && (
                    pageProducts.length === 0
                      ? (
                        <div className="w-full flex flex-col gap-4 items-center mt-8">
                          <div
                            style={{
                              backgroundImage: "url('/emptyOrder.jpg')"
                            }}
                            className="w-[220px] h-[250px] bg-cover bg-no-repeat bg-center"></div>
                          <div className='text-center text-[18px] font-bold text-bgPrimary leading-[32px] uppercase'>
                            {/* search */}
                            Chưa có người dùng nào
                          </div>
                        </div>
                      )
                      : (
                        pageProducts.map((user) => (
                          <tr
                            key={user.id}
                            className='grid items-center grid-cols-12 gap-2 rounded-[4px] h-[70px] border border-transparent border-b-[#ececec]'>
                            <td className='col-span-2 flex items-center justify-center'>
                              <img src={user.avatar} alt="" className='col-span-7 flex flex-col w-[50px] aspect-square rounded-full' />
                            </td >
                            <td className='col-span-3 flex ' >
                              <span className='text-[16px] line-clamp-2'>{user.displayName}</span>
                            </td >
                            <td className='col-span-3 flex items-center py-2'>
                              <p className="">{user.displayEmail}</p>
                            </td>
                            <td className='col-span-2 flex items-center justify-center font-bold'>
                              <p className='text-bgPrimary text-center text-[16px]'>
                                {user.orderQuantity}
                              </p>
                            </td>
                            <td className='col-span-2 flex items-center font-bold justify-center'>
                              <button
                                // onClick={(e) => {
                                //   setOrderID(order.id)
                                //   setOrderDetailAdmin(true)
                                //   navigate(`/admin/view-orders/${order.id}`)
                                // }}
                                className='bg-primary text-white px-2 py-1 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
                                <span className='tracking-wider uppercase text-[14px] font-medium'>Xem chi tiết</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )
                  )}
              </tbody>
            </table>
          </div>
          {loading && (
            <div className="w-full h-[350px]">
              <Spinning color='#1f2028' size='30px' />
            </div>
          )}
          {!loading && allUsers.length === 0 && (
            <div className="w-full h-full flex flex-col gap-8 items-center justify-center mt-[-24px]">
              <div
                style={{
                  backgroundImage: "url('/emptyOrder.jpg')"
                }}
                className="w-[320px] h-[200px] bg-cover bg-no-repeat bg-center"></div>
              {/* khi chưa có người dùng nào */}
              <div className='text-center text-[20px] font-bold text-bgPrimary font-mono leading-[32px] uppercase'>Chưa có người dùng nào được tạo ra
              </div>
            </div>
          )}
        </div>
        {!loading && (
          <div className="">
            <Pagination
              products={allUsersSort}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              quantity={quantity}
              setPageProducts={setPageProducts} />
          </div>
        )}
      </div >
    </>
  );
};

export default ViewUsers;