import React, { useEffect, useState } from 'react';
import CarLoading from '../../components/carLoading/CarLoading';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useSelector } from 'react-redux';
import { selectUserID } from '../../redux-toolkit/slice/authSlice';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags } from '@fortawesome/free-solid-svg-icons';
import { selectEmail } from '../../redux-toolkit/slice/authSlice';
import { selectUserName } from '../../redux-toolkit/slice/authSlice';

const CheckOut = () => {
  const [loading, setLoading] = useState(false)
  const [totalPayment, setTotalPayment] = useState(0)
  const [cartProducts, setCartProducts] = useState([])
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')
  const displayEmail = useSelector(selectEmail) || localStorage.getItem('displayEmail')
  const displayName = useSelector(selectUserName) || localStorage.getItem('displayName')


  const getCartProducts = async () => {
    setLoading(true)
    const productsRef = query(collection(db, "cartProducts"), where('userID', "==", userID));
    const q = query(productsRef);
    try {
      const querySnapshot = await getDocs(q);
      await new Promise((resolve) => {
        const allCartProducts = querySnapshot.docs
          .map((doc) => {
            return {
              ...doc.data(),
              idCartProduct: doc.id,
            }
          })
          .sort((cartProductA, cartProductB) => (new Date(cartProductB.addAt)) - (new Date(cartProductA.addAt)))
        resolve(allCartProducts)
      }).then((allCartProducts) => {
        //
        const totalPayment = allCartProducts.reduce((total, item) => {
          return total + item.price * item.quantity
        }, 0)
        setTotalPayment(totalPayment)
        // localStorage.setItem('totalPayment', JSON.stringify(totalPayment))
        // dispatch(CAlC_TOTAL_PAYMENT(totalPayment))
        //
        // localStorage.setItem('cartLength', JSON.stringify(allCartProducts.length))
        setTimeout(() => {
          setCartProducts(allCartProducts)
          setLoading(false)
        }, 254)
      })
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  }

  useEffect(() => {
    getCartProducts()
  }, [])


  return (
    <>
      {loading
        ? <CarLoading />
        : (
          <div className="w-full py-[30px]">
            <div className="w-full h-full bg-red-500"></div>
            <div className="max-w-[1230px] mx-auto ">
              <div className="w-full px-[15px] pb-[30px]">
                <div className="w-full flex">
                  <>
                    {/* left */}
                    <div className="basis-[58.33%] pr-[30px] border border-transparent border-r-[#ececec]">
                      <h1 className='text-[18px] mb-4 font-bold text-bgPrimary uppercase'>
                        Thông tin thanh toán
                      </h1>
                      <div className="w-full text-[#222] text-[14px] flex flex-col gap-5 ">
                        <p>
                          <label className='mb-2 font-bold block' htmlFor="account_display_name">Tên hiển thị *</label>
                          <input
                            placeholder={displayName || localStorage.getItem('displayName') || ""}
                            name="name"
                            className='align-middle pointer-events-none bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2 transition-all ease-linear duration-150 focus:shadow-shadowPink focus:border focus:border-[#ea4c8966]' id='account_display_name' type="text" />
                          <span className='text-[#353535] text-[16px] italic'>Để thay đổi tên hãy vào "Thông tin tài khoản"</span>
                        </p>

                        <p>
                          <label className='mb-2 font-bold block'>Địa chỉ email *</label>
                          <input
                            name="email"
                            autoComplete="off"
                            placeholder={displayEmail || localStorage.getItem('displayEmail') || ""}
                            className='align-middle pointer-events-none bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                          <span className='text-[#353535] text-[16px] italic'>Bạn không thể thay đổi email</span>
                        </p>

                        <p>
                          <label className='mb-2 font-bold block'>Quốc gia *</label>
                          <input
                            name="national"
                            autoComplete="off"
                            placeholder="Hãy chọn quốc gia của bạn"
                            className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                        </p>

                        <p>
                          <label className='mb-2 font-bold block'>Tỉnh / Thành phố *</label>
                          <input
                            name="city"
                            autoComplete="off"
                            placeholder="Nhập vào tỉnh/ thành phố"
                            className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                        </p>

                        <p>
                          <label className='mb-2 font-bold block'>Địa chỉ cụ thể *</label>
                          <input
                            name="address"
                            autoComplete="off"
                            placeholder="Nhập vào địa chỉ nhà cụ thể"
                            className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                        </p>

                        <p>
                          <label className='mb-2 font-bold block'>Số điện thoại *</label>
                          <input
                            name="phoneNumber"
                            autoComplete="off"
                            placeholder="Nhập vào số điện thoại liên hệ"
                            className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                        </p>

                        <p>
                          <label className='mb-2 font-bold block'>Ghi chú đơn hàng (tùy chọn)</label>
                          <textarea
                            name="phoneNumber"
                            autoComplete="off"
                            cols={30}
                            rows={5}
                            placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                            className='align-middle bg-white shadow-sm text-[#222] px-3 pt-3 block w-full text-[16px] border border-solid border-[#ccc] rounded-[4px] bg-transparent outline-none' type="text" />
                        </p>

                      </div>
                    </div>
                    {/* right */}
                    <div className="flex-1 pt-[15px] pb-[30px] px-[30px] h-full border-[2px] border-solid border-primary">
                      <div className="w-full border-[3px] border-transparent border-b-[#ececec] text-[18px] font-bold py-2 uppercase tracking-wider">
                        <h1 className='mb-4'>Đơn hàng của bạn</h1>
                        <div className="flex justify-between">
                          <h2 className='text-[14px] tracking-widest'>Sản phẩm</h2>
                          <h2 className='text-[14px] tracking-widest'>Tổng</h2>
                        </div>
                      </div>
                      {cartProducts.map((cartProduct, idx) => (
                        <div
                          key={cartProduct.idCartProduct}
                          className='flex items-center justify-between border border-transparent border-b-[#ddd] py-4 text-[14px]'>
                          <h2
                            className='text-[#666]'>{cartProduct.name}
                            <strong className='text-bgPrimary font-blod ml-1'>× {cartProduct.quantity}</strong>
                          </h2>
                          <div className="float-right">
                            <span
                              className='font-bold inline-block'>{`${solvePrice(cartProduct.price * cartProduct.quantity)} ₫`}
                            </span>
                          </div>
                        </div>
                      ))}

                      <div className='flex items-center justify-between border border-transparent border-b-[#ddd] py-2 text-[14px]'>
                        <h2 className=''>Tổng phụ</h2>
                        <h2 className='font-bold'>{solvePrice(totalPayment)} ₫</h2>
                      </div>
                      <div className='flex items-center justify-between border border-transparent border-b-[#ddd] py-4 text-[14px]'>
                        <h2 className=''>Giao hàng</h2>
                        <div className="">
                          <p>Phí giao hàng toàn quốc: <span className='font-bold'>30.000 ₫</span></p>
                        </div>
                      </div>
                      <div className='flex items-center justify-between border-[3px] border-transparent border-b-[#ddd] py-2 text-[14px]'>
                        <h2 className=''>Tổng thanh toán</h2>
                        <h2 className='font-bold'>{solvePrice(totalPayment + 30000)} ₫</h2>
                      </div>
                      <div className='mt-6 text-[14px]'>
                        <div className="flex flex-col gap-4 mb-8">
                          <div className="flex gap-2">
                            <input type="radio" name="checkbox" id="checkbox-1" />
                            <label htmlFor='checkbox-1' className='text-[14px] font-bold'>Trả tiền mặt khi nhận hàng</label>
                          </div>
                          <div className="flex gap-2">
                            <input type="radio" name="checkbox" id="checkbox-2" />
                            <label htmlFor='checkbox-2' className='text-[14px] font-bold'>Chuyển khoản ngân hàng</label>
                          </div>
                        </div>
                        <NavLink
                          // onClick={}
                          className='w-full px-6 py-3 bg-secondary font-bold tracking-widest text-white hover:brightness-90 transition-all ease-in-out duration-100 uppercase'>Đặt hàng
                        </NavLink>
                      </div>
                    </div>
                  </>
                </div>
              </div>
            </div>
          </div >
        )}

    </>
  );
};

export default CheckOut;