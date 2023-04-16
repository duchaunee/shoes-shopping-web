import React, { useEffect, useState } from 'react';
import CarLoading from '../../components/carLoading/CarLoading';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useSelector } from 'react-redux';
import { selectUserID } from '../../redux-toolkit/slice/authSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft, faTags } from '@fortawesome/free-solid-svg-icons';
import { selectEmail } from '../../redux-toolkit/slice/authSlice';
import { selectUserName } from '../../redux-toolkit/slice/authSlice';
import { OverlayLoading, Skeleton } from '../../animation-loading';
import { toast } from 'react-toastify';

const CheckOut = () => {
  const [loading, setLoading] = useState(true)
  const [loadingNavigate, setLoadingNavigate] = useState(false)
  const [totalPayment, setTotalPayment] = useState(0)
  const [allProducts, setAllProducts] = useState([])
  const [cartProducts, setCartProducts] = useState([])
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')
  const displayEmail = useSelector(selectEmail) || localStorage.getItem('displayEmail')
  const displayName = useSelector(selectUserName) || localStorage.getItem('displayName')
  //
  const navigate = useNavigate()
  //
  const [deliveryFee, setDeliveryFee] = useState(30000)

  const getProducts = async () => {
    const productsRef = collection(db, "products");
    const q = query(productsRef);
    try {
      const querySnapshot = await getDocs(q);
      const allProducts = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })
      setAllProducts(allProducts)
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const getCartProducts = async () => {
    setLoading(true)
    const productsRef = query(collection(db, "cartProducts"), where('userID', "==", userID));
    const q = query(productsRef);
    if (allProducts.length > 0) {
      try {
        const querySnapshot = await getDocs(q);
        await new Promise((resolve) => {
          const allCartProducts = querySnapshot.docs
            .map((doc) => {
              // console.log(doc.data().id);
              const newProduct = allProducts.filter((product) => product.id === doc.data().id)[0]
              // console.log('newProduct: ', newProduct);
              return {
                ...doc.data(),
                name: newProduct.name,
                price: newProduct.price,
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
          localStorage.setItem('cartLength', JSON.stringify(allCartProducts.length))
          setTimeout(() => {
            setCartProducts(allCartProducts)
            setLoading(false)
          }, 1200)
        })
      }
      catch (e) {
        console.log(e.message);
      }
    }
  }

  const getVouchers = async () => {
    const productsRef = query(collection(db, "vouchers"));
    const q = query(productsRef);
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.docs.map(doc => {
        const { code, activeCode } = doc.data()
        console.log(code, activeCode);
        if (code === 'FREESHIP' && activeCode) setDeliveryFee(0)
        if (code === 'GIAM50K' && activeCode) setTotalPayment(prev => prev - 50000)
      })
    } catch (e) {
      console.log(e.message);
    }
  }

  //để xử lí khi ấn đặt hàng thì sẽ xóa tất cả sản phẩm trong giỏ hàng
  const handleDeleteAllCart = async () => {
    const productsRef = query(
      collection(db, "cartProducts"),
      where('userID', "==", userID));
    const q = query(productsRef);
    try {
      const querySnapshot = await getDocs(q);
      //doc.id là id của firebase tạo riêng cho mỗi sản phẩm, còn doc.data() là dữ liệu của sản phẩm, nên doc.data().id tức là id của bên trong cái object sản phẩm {}
      Promise.all(
        querySnapshot.docs.map(async (docQuery) => {
          try {
            await deleteDoc(doc(db, "cartProducts", docQuery.id));
            return Promise.resolve()
          } catch (e) {
            console.log(e.message);
          }
        })
      )
    }
    catch (e) {
      console.log(e.message);
    }
  }

  const handleOrder = async (e) => {
    if (!loading) {
      e.preventDefault()
      window.scrollTo({
        top: 0,
        // behavior: 'smooth'
      });
      setLoadingNavigate(true)
      //CHỖ NÀY SẼ await HANDLE VIỆC ĐẨY ORDER LÊN FIREBASE SAU ĐÓ MỚI XÓA SẢN PHẨM TRONG GIỎ HÀNG

      await handleDeleteAllCart() //xóa tất cả sp trong giỏ hàng khi ấn đặt hàng
      setTimeout(() => {
        navigate('/')
        // navigate('/')  den trang thanh toan thanh cong
        // setLoading(false)
        toast.success("Đặt hàng thành công. Vui lòng kiếm tra trong 'Đơn hàng'", {
          autoClose: 1200,
          position: 'top-left'
        })
      }, 1600)
    }
  }

  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  }

  useEffect(() => {
    getProducts()
  }, [])

  useEffect(() => {
    (async function () {
      await getCartProducts()
      await getVouchers()
    })()
  }, [allProducts])

  return (
    <>
      <OverlayLoading loading={loadingNavigate}>
        <div className="w-full py-[30px]">
          <div className="max-w-[1230px] mx-auto ">
            <div className="w-full px-[15px] pb-[30px]">
              <div className="w-full flex">
                {(cartProducts.length === 0
                  || JSON.parse(localStorage.getItem('cartLength')) === 0) && !loading
                  ? <div className="w-full h-[480px] flex flex-col gap-10 items-center justify-center">
                    <img className='w-full h-[300px] object-contain' src="../../orderNoExist.png" alt="" />
                    <h1 className='text-center text-[36px] font-bold text-bgPrimary font-mono leading-[32px] uppercase'>Đơn hàng không tồn tại</h1>
                    <NavLink
                      to='/'
                      className='bg-primary text-white px-4 py-3 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
                      <FontAwesomeIcon className='mr-[6px]' icon={faLongArrowAltLeft} />
                      <span className='text-[20px]'>Quay lại trang chủ</span>
                    </NavLink>
                  </div>
                  : (
                    <form className='w-full flex flex-row' onSubmit={handleOrder}>
                      {/* left */}
                      <div className="basis-[58.33%] pr-[30px]">
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
                            <span className='text-[#353535] text-[16px] italic'>Để thay đổi tên, hãy vào "Thông tin tài khoản"</span>
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
                            <label className='mb-2 font-bold block'>Tỉnh / Thành phố *</label>
                            <input
                              name="city"
                              autoComplete="off"
                              required
                              placeholder="Nhập vào tỉnh/ thành phố"
                              className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                          </p>

                          <p>
                            <label className='mb-2 font-bold block'>Quận / Huyện *</label>
                            <input
                              name="district"
                              autoComplete="off"
                              required
                              placeholder="Nhập vào quận/ huyện"
                              className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                          </p>

                          <p>
                            <label className='mb-2 font-bold block'>Phường / Xã *</label>
                            <input
                              name="wards"
                              autoComplete="off"
                              required
                              placeholder="Nhập vào phường/ xã"
                              className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                          </p>

                          <p>
                            <label className='mb-2 font-bold block'>Địa chỉ cụ thể *</label>
                            <input
                              name="address"
                              autoComplete="off"
                              required
                              placeholder="Nhập vào địa chỉ nhà cụ thể"
                              className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                          </p>

                          <p>
                            <label className='mb-2 font-bold block'>Số điện thoại *</label>
                            <input
                              name="phoneNumber"
                              autoComplete="off"
                              required
                              placeholder="Nhập vào số điện thoại liên hệ"
                              className='align-middle bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="number" />
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
                      <div className={`self-start flex-1 pt-[15px] pb-[30px] px-[30px] border-[2px] border-solid ${!loadingNavigate && 'border-primary'}`}>
                        <div className="w-full border-[3px] border-transparent border-b-[#ececec] text-[18px] font-bold py-2 uppercase tracking-wider">
                          <h1 className='mb-4'>Đơn hàng của bạn</h1>
                          <div className="flex justify-between">
                            <h2 className='text-[14px] tracking-widest'>Sản phẩm</h2>
                            <h2 className='text-[14px] tracking-widest'>Tổng</h2>
                          </div>
                        </div>
                        {(cartProducts.length === 0
                          ? Array(3).fill()
                          : cartProducts).map((cartProduct, idx) => (
                            <div
                              key={idx}
                              className={`${!loading ? 'py-4' : 'my-2'} grid grid-cols-7 items-center justify-center border border-transparent border-b-[#ddd] text-[14px]`}>
                              <Skeleton loading={loading} className={`${loading && 'mb-2 w-3/4 h-[30px]'} overflow-hidden col-span-5`}>
                                <h2
                                  className='text-[#666]'>{cartProduct?.name || 'day la ten de chay skeleton animation animation animation animation'}
                                  <strong className='text-bgPrimary font-blod ml-1'>× {cartProduct?.quantity}</strong>
                                </h2>
                              </Skeleton>
                              <Skeleton loading={loading} className='overflow-hidden col-span-2 text-right'>
                                <div className="">
                                  <span
                                    className='font-bold inline-block'>
                                    {cartProduct?.price
                                      ? `${solvePrice(cartProduct?.price * cartProduct?.quantity)} ₫`
                                      : 'day la gia tien'}
                                  </span>
                                </div>
                              </Skeleton>
                            </div>
                          ))}

                        <div className='flex items-center justify-between border border-transparent border-b-[#ddd] py-2 text-[14px]'>
                          <Skeleton loading={loading} className='overflow-hidden'>
                            <h2 className=''>Tổng phụ</h2>
                          </Skeleton>
                          <Skeleton loading={loading} className='overflow-hidden'>
                            <h2 className='font-bold'>
                              {totalPayment
                                ? `${solvePrice(totalPayment)} ₫`
                                : 'day la tong tien'}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className='flex items-center justify-between border border-transparent border-b-[#ddd] py-4 text-[14px]'>
                          <Skeleton loading={loading} className='overflow-hidden'>
                            <h2 className=''>Giao hàng</h2>
                          </Skeleton>
                          <Skeleton loading={loading} className='overflow-hidden'>
                            <div className="">
                              <p className='text-right'>
                                Phí giao hàng toàn quốc:
                                <span className='font-bold ml-1'>{`${solvePrice(deliveryFee)} ₫`}</span>
                              </p>
                            </div>
                          </Skeleton>
                        </div>
                        <div className='flex items-center justify-between border-[3px] border-transparent border-b-[#ddd] py-2 text-[14px]'>
                          <Skeleton loading={loading} className='overflow-hidden'>
                            <h2 className=''>Tổng thanh toán</h2>
                          </Skeleton>
                          <Skeleton loading={loading} className='overflow-hidden'>
                            <h2 className='font-bold'>
                              {totalPayment
                                ? `${solvePrice(totalPayment + deliveryFee)} ₫`
                                : 'day la tong tien'}
                            </h2>
                          </Skeleton>
                        </div>
                        <div className='mt-6 text-[14px]'>
                          <div className="flex flex-col gap-4 mb-8">
                            <div className="flex gap-2">
                              <input type="radio" defaultChecked name="checkbox" id="checkbox-1" />
                              <label htmlFor='checkbox-1' className='text-[14px] font-bold'>Trả tiền mặt khi nhận hàng</label>
                            </div>
                            <div className="flex gap-2">
                              <input type="radio" name="checkbox" id="checkbox-2" />
                              <label htmlFor='checkbox-2' className='text-[14px] font-bold'>Chuyển khoản ngân hàng</label>
                            </div>
                          </div>
                          <button
                            className='px-6 py-3 bg-secondary font-bold tracking-widest text-white hover:brightness-90 transition-all ease-in-out duration-100 uppercase'>Đặt hàng
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

              </div>
            </div>
          </div>
        </div >
      </OverlayLoading>
    </>
  );
};

export default CheckOut;