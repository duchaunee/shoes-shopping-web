
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltLeft, faTags } from '@fortawesome/free-solid-svg-icons';
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserID } from '../../redux-toolkit/slice/authSlice';
import CartProduct from './CartProduct';
import CarLoading from '../../components/carLoading/CarLoading';
import { toast } from 'react-toastify';
import { CAlC_TOTAL_PAYMENT } from '../../redux-toolkit/slice/cartSlice';
import { VOUCHERS } from '../../voucherShop';

const Cart = () => {
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)
  const dispatch = useDispatch()
  const [totalPayment, setTotalPayment] = useState(0)
  const [cartProducts, setCartProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [quantityCart, setQuantityCart] = useState({})
  const userID = useSelector(selectUserID) || localStorage.getItem('userID')


  // lí do có hàm này là do khi admin đổi tên, ảnh,... thì trong giỏ hàng cũng phải cập nhật thông tin mới nhất
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
      toast.error(e.message, {
        autoClose: 1000
      })
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
                imgURL: newProduct.imgURL,
                name: newProduct.name,
                price: newProduct.price,
                category: newProduct.category,
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
          localStorage.setItem('totalPayment', JSON.stringify(totalPayment))
          dispatch(CAlC_TOTAL_PAYMENT(totalPayment))
          //
          localStorage.setItem('cartLength', JSON.stringify(allCartProducts.length))
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
  }

  const handleUpdateCartProduct = async () => {
    setLoading(true)
    cartProducts.forEach(async (cartProduct, idx) => {
      // console.log(quantityCart[cartProduct.idCartProduct]);
      const productsRef = query(
        collection(db, "cartProducts"),
        where('userID', "==", userID), //id người dùng
        where('id', "==", cartProduct.id)); //id của sản phẩm
      const q = query(productsRef);

      try {
        const querySnapshot = await getDocs(q);
        const docRef = querySnapshot.docs[0].ref;
        //
        const docSnapshot = await getDoc(docRef);
        // console.log(docSnapshot.data());

        await updateDoc(docRef, {
          quantity: quantityCart[cartProduct.idCartProduct],
        });

        if (idx === cartProducts.length - 1) {
          setDone(true)
          //update cart
          setTimeout(() => {
            toast.success(`Cập nhật giỏ hàng thành công`, {
              position: "top-left",
              autoClose: 1200
            })
          }, 500)
          // setLoading(false)
        }
      } catch (e) {
        console.log(e.message);
      }
    })
  }

  const deliveryDate = () => {
    const today = new Date()
    const startDelivary = new Date()
    const endDelivary = new Date()
    startDelivary.setDate(today.getDate() + 2)
    endDelivary.setDate(today.getDate() + 5)

    //tháng bắt đầu từ 0 nên phải +1
    return (
      `${startDelivary.getDate()} Th${startDelivary.getMonth() + 1 < 10 ? `0${startDelivary.getMonth() + 1}` : startDelivary.getMonth() + 1} - ${endDelivary.getDate()} Th${endDelivary.getMonth() + 1 < 10 ? `0${endDelivary.getMonth() + 1}` : endDelivary.getMonth() + 1}`
    )
  }

  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  }

  useEffect(() => {
    setDone(false)

    getProducts()
    getCartProducts()
  }, [done])

  useEffect(() => {
    getCartProducts()
  }, [allProducts])

  return (
    <>
      {loading
        ? <CarLoading />
        : (
          <div className="w-full py-[30px]">
            <div className="w-full h-full bg-red-500"></div>
            <div className="max-w-[1230px] min-h-[800px] mx-auto ">
              <div className="w-full px-[15px] pb-[30px]">
                <div className="w-full flex">
                  {cartProducts.length === 0
                    || JSON.parse(localStorage.getItem('cartLength')) === 0
                    ? <div className="w-full h-[480px] flex flex-col gap-10 items-center justify-center">
                      <img className='w-full h-[300px] object-contain' src="../../emptyCart.png" alt="" />
                      <NavLink
                        to='/'
                        className='bg-primary text-white px-4 py-3 hover:bg-[#a40206] transition-all ease-linear duration-[120ms]'>
                        <FontAwesomeIcon className='mr-[6px]' icon={faLongArrowAltLeft} />
                        <span className='text-[20px]'>Quay lại trang chủ</span>
                      </NavLink>
                    </div>
                    : (
                      <>
                        {/* left */}
                        <div className="basis-[58.33%] pr-[30px] border border-transparent border-r-[#ececec]">
                          <table className='w-full'>
                            <thead>
                              <tr className='border-[3px] border-transparent border-b-[#ececec] grid gap-5 grid-cols-12 grid-rows-1 text-[14px] font-bold py-2 uppercase tracking-wider'>
                                <td className='col-span-6'>Sản phẩm</td>
                                <td className='col-span-2'>Giá</td>
                                <td className='col-span-2'>Số lượng</td>
                                <td className='col-span-2'>Tổng</td>
                              </tr>
                            </thead>
                            <tbody>
                              {cartProducts.map((cartProduct) => (
                                <CartProduct
                                  key={cartProduct.idCartProduct}
                                  setDone={setDone}
                                  setLoading={setLoading}
                                  quantityCart={quantityCart}
                                  setQuantityCart={setQuantityCart}
                                  idProduct={cartProduct.id}
                                  name={cartProduct.name}
                                  nameInput={cartProduct.idCartProduct}
                                  category={cartProduct.category}
                                  img={cartProduct.imgURL}
                                  price={cartProduct.price}
                                  quantityProduct={cartProduct.quantity}
                                />
                              ))}
                            </tbody>
                          </table>
                          <div className="mt-6 flex gap-4">
                            <NavLink
                              to='/'
                              className='border-[2px] border-primary text-primary px-4 py-1 hover:bg-primary hover:text-white flex items-center font-medium transition-all ease-linear duration-[120ms]'>
                              <FontAwesomeIcon className='mr-[6px]' icon={faLongArrowAltLeft} />
                              <span className='text-[14] uppercase'>Tiếp tục xem sản phẩm</span>
                            </NavLink>
                            <button
                              onClick={handleUpdateCartProduct}
                              className='px-4 py-1 bg-primary hover:bg-[#9f0d11] text-white font-medium transition-all ease-linear flex items-center duration-[120ms]'>
                              <span className='text-[14] uppercase'>Cập nhật giỏ hàng</span>
                            </button>
                          </div>
                        </div>
                        {/* right */}
                        <div className="flex-1 pt-[15px] pb-[30px] px-[30px] h-full border-[2px] border-solid border-primary">
                          <div className="w-full border-[3px] border-transparent border-b-[#ececec] text-[14px] font-bold py-2 uppercase tracking-wider">
                            <h1 className=''>Tổng thanh toán</h1>
                          </div>
                          <div className='flex items-center justify-between border border-transparent border-b-[#ddd] py-4 text-[14px]'>
                            <h2 className=''>Tổng phụ</h2>
                            <h2 className='font-bold'>{solvePrice(totalPayment)}₫</h2>
                          </div>
                          <div className='flex items-center justify-between border border-transparent border-b-[#ddd] py-4 text-[14px]'>
                            <h2 className=''>Giao hàng</h2>
                            <div className="">
                              {/* lấy 1% giá trị hàng */}
                              <p>Phí giao hàng toàn quốc: <span className='font-bold'>30.000 ₫</span></p>
                              <p className=''>Nhận hàng vào <span className='font-bold'>{deliveryDate()}</span></p>
                            </div>
                          </div>
                          <div className='flex items-center justify-between border-[3px] border-transparent border-b-[#ddd] py-4 text-[14px]'>
                            <h2 className=''>Tổng thanh toán</h2>
                            <h2 className='font-bold'>{solvePrice(totalPayment + 30000)}₫</h2>
                          </div>
                          <div className='mt-6 text-[14px]'>
                            <NavLink
                              to='/thanh-toan'
                              className='block text-center w-full px-2 py-3 bg-secondary font-bold tracking-widest text-white hover:brightness-90 transition-all ease-in-out duration-100 uppercase'>Tiến hành thanh toán
                            </NavLink>
                            <div className="pt-6 pb-3 flex gap-2 border-[2px] border-transparent border-b-[#ddd]">
                              <FontAwesomeIcon
                                className='text-[#b0b0b0] text-[20px]'
                                icon={faTags}
                                rotation={90} />
                              <p className='font-bold text-[16px]'>Phiếu ưu đãi</p>
                            </div>
                            <input
                              className='my-5 text-[16px] w-full px-3 py-2 outline-none border border-[#ccc] focus:shadow-shadowPink'
                              placeholder='Mã ưu đãi'
                              type="text" name="" id="" />
                            <button
                              onClick={() => setTotalPayment(prev => prev - 30000)}
                              className='w-full p-2 border border-[#ccc] bg-[#f9f9f9] hover:bg-[#c7c7c7] flex items-center justify-center -tracking-tighter text-[16px] text-[#666] transition-all ease-in-out duration-100'>Áp dụng</button>
                          </div>
                        </div>
                      </>
                    )}
                </div>
              </div>
            </div>
          </div >
        )}

    </>
  );
};

export default Cart;