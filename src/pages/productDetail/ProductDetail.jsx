import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { db } from '../../firebase/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faMinus, faPlus, faStar, faTags } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAdmin } from '../../redux-toolkit/slice/authSlice';
import CarLoading from '../../components/carLoading/CarLoading'

const solvePrice = (price) => {
  return Number(price).toLocaleString('vi-VN');
}

const ProductDetail = () => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState({})
  const navigate = useNavigate()
  const admin = useSelector(selectIsAdmin) || JSON.parse(localStorage.getItem('admin'))

  const getProduct = async () => {
    setLoading(true)
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setProduct({
        id: id,
        ...docSnap.data()
      })
      localStorage.setItem('showProduct', JSON.stringify({
        id: id,
        ...docSnap.data()
      }))
      setTimeout(() => {
        setLoading(false)
      }, 1000)
    } else {
      // docSnap.data() will be undefined in this case
      // console.log("No such document!");
    }
  }

  //đếm xem cái product có mấy ảnh preview
  const countImgPriview = () => {
    let count = 0;
    Array(4).fill().map((_, idx) => {
      if (product[`imgPreviewURL${idx + 1}`]) count++;
    })
    return count;
  }
  const solveCategory = (category) => {
    switch (category) {
      case 'giay-nam':
        return 'Nam'
      case 'giay-nu':
        return 'Nữ'
      case 'giay-tre-em':
        return 'Trẻ em'
      default:
        break;
    }
  }

  const detectUser = (functionAdmin, functionUser) => {
    if (admin) return functionAdmin;
    return functionUser
  }

  const handleDetectAdmin = () => {
    navigate(`/admin/add-product/${id}`)
  }

  const handleAddToCart = () => {
    console.log('them vao gio');
  }

  useEffect(() => {
    getProduct()
  }, [])

  return (
    <>
      {loading
        ? <CarLoading />
        : <>
          {/* top */}
          <div className="w-full">
            <div className="w-full h-full py-10">
              <div className="max-w-[1230px] h-full mx-auto flex">
                {/* left */}
                <div className="flex-1 px-[15px]">
                  <img className='w-[600px] h-[425px] cursor-pointer mb-[15px]' src={product.imgURL} alt="" />
                  <div className="w-full h-[70px] min-[1024px]:h-[95px] "> {/* cai nay de tao margin am, phai co 1 the cha boc no moi dung dc */}
                    <div className="h-full mx-[-10px] grid grid-cols-4 grid-rows-1">
                      {Array(countImgPriview()).fill().map((_, idx) => (
                        <div
                          key={idx}
                          className="px-[10px] col-span-1 w-full h-full">
                          <img
                            // opacity-40
                            className={` cursor-pointer border-[2px] rounded-[2px] border-[#858585] h-full inline-block w-full`}
                            src={product[`imgPreviewURL${idx + 1}`]}
                            alt="" />
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* <div className="w-full flex-grow bg-red-500"></div> */}
                </div>

                {/* right */}
                <div className="flex-1 px-[15px] pb-[30px]">
                  <nav className='text-[#94949e] uppercase text-[14px]'>
                    <NavLink className='transition-all ease-linear duration-100 hover:text-bgPrimary hover:opacity-70mb-2' to='/'>Trang chủ</NavLink>
                    <div className="mx-2 inline-block">/</div>
                    <NavLink
                      to={`/${product.category}`}
                      className='transition-all ease-linear duration-100 hover:text-bgPrimary hover:opacity-70mb-2'>{solveCategory(product.category)}</NavLink>
                  </nav>
                  <h1 className='text-[28px] text-bgPrimary font-semibold mb-[14px]'>{product.name}</h1>
                  <div className="flex gap-3">
                    <div className="">
                      <FontAwesomeIcon className='text-[#f9dc4b] text-[18px] mr-2' icon={faStar} />
                      <p className='inline-block text-[#767676] font-medium'>4.6</p>
                    </div>
                    <div className="w-[2px] bg-[#e6e6e6]"></div>
                    <p className='text-[#767676] font-medium'>432 Đánh giá</p>
                  </div>
                  <div className="mt-[22px] mb-4 flex items-center gap-3">
                    {/* cái đề để tránh flex nó làm cho height tăng theo thằng con dài nhất mà mình chỉ muốn nó py-1 theo font thui */}
                    <div className="">
                      <div className="inline-flex rounded-[12px] items-center gap-1 w-auto bg-[#6ab87e]/20 py-1 px-2">
                        <FontAwesomeIcon className='text-[#6ab87e] text-[14px]' icon={faTags} />
                        <p className='text-[#6ab87e] font-medium text-[14px]'>50%</p>
                      </div>
                    </div>
                    <p className="inline-block line-through text-[#aaa] text-[16px]">
                      {solvePrice(Math.floor(product.price + (product.price * 50) / 100))}
                      <span className='text-[14px] align-top'>₫</span>
                    </p>
                    <p className="inline-block font-semibold text-[26px] text-bgPrimary">
                      {solvePrice(product.price)}
                      <span className='text-[22px] align-top'>₫</span>
                    </p>
                  </div>
                  <div className="w-[50px] h-[2px] bg-black/20 my-[20px]"></div>
                  <div className="mb-[25px]">
                    <p className='font-medium text-[18px] text-[#1b1b1b] mb-3'>Select Size: 39</p>
                    <ul className='inline-flex gap-3'>
                      {[39, 40, 41, 42, 43].map((size) => (
                        <li
                          key={size}
                          className='inline-block font-medium transition-all ease-linear duration-100 cursor-pointer hover:bg-[#1d242e] hover:text-white py-[6px] w-[65px] text-center rounded-[4px] text-[18px] text-[#1b1b1b] bg-[#e8e8e8]'>{size}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-[25px] inline-grid grid-cols-12 gap-6 w-[373px] h-[46px]">
                    <div className="col-span-5 flex items-center justify-center gap-2 px-3 py-1 rounded-[4px] border border-[#ccc] ">
                      <button type='button' className='flex items-center outline-none text-bgPrimary font-medium '>
                        <FontAwesomeIcon className='text-[18px] font-medium' icon={faMinus} />
                      </button>
                      <input
                        type="number" min='1' max='999' defaultValue='5' name="" id=""
                        className='text-bgPrimary outline-none text-center text-[18px] font-medium' />
                      <button type='button' className='flex items-center outline-none text-bgPrimary font-medium '>
                        <FontAwesomeIcon className='text-[18px] font-medium' icon={faPlus} />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        localStorage.setItem('prevLinkEditProduct', `/san-pham/${id}`)
                        detectUser(handleDetectAdmin, handleAddToCart)()
                      }}
                      className='col-span-7 h-full px-3 bg-primary text-white text-[16px] leading-[37px] font-bold tracking-[1px] uppercase transition-all ease-in duration-150 focus:outline-none hover:bg-[#a40206]'>
                      {admin ? "Sửa sản phẩm" : "Thêm sản phẩm"}
                    </button>
                  </div>
                  <div className="w-full py-4 px-6 shadow-shadowHover">
                    <p className="font-bold text-[18px] leading-[22px] mt-1 mb-5">Quyền lợi khách hàng & Bảo hành</p>
                    <div className="inline-flex gap-2 my-2">
                      <FontAwesomeIcon className='text-[#6ab87e] text-[22px]' icon={faCircleCheck} />
                      <p className='text-[16px] font-bold'>Chính sách hoàn trả của ShoesPlus</p>
                    </div>
                    <p className='text-[16px] ml-[30px]'>Trả hàng hoàn tiền trong vòng 48 giờ cho các sản phẩm bị lỗi kỹ thuật, bể vỡ, không đúng mô tả hoặc không đúng như đơn đặt hàng.</p>

                    <div className="inline-flex gap-2 my-2">
                      <FontAwesomeIcon className='text-[#6ab87e] text-[22px]' icon={faCircleCheck} />
                      <p className='text-[16px] font-bold'>Chính sách bảo hành của ShoesPlus</p>
                    </div>
                    <p className='text-[16px] ml-[30px]'>Bảo hành bao gồm các lỗi do nhà sản xuất như lỗi về chất liệu, lỗi thiết kế. Không bao gồm các lỗi do sử dụng sai cách hoặc tai nạn gây ra.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* bottom */}
          <div className="w-full ">
            <div className="max-w-[1230px] h-full px-[15px] mx-auto">
              {/* danh gia */}
              <div className="w-full h-full py-[30px] ">
                <div className="w-full h-full p-[30px] shadow-xl">
                  <div className="pb-[46px]">
                    <h1 className='font-bold text-[20px] leading-[32px]'>Đánh giá</h1>
                    <h3 className='text-[18px] leading-[32px]'>Chưa có đánh giá nào</h3>
                  </div>
                  <div className="w-full py-[15px] px-[30px] border-[2px] border-primary">
                    <h1 className='font-bold text-[20px] leading-[32px]'>Đánh giá</h1>
                  </div>
                </div>
              </div>
              {/* sp tuong tu */}
            </div>
          </div>
        </>
      }


    </>
  );
};

export default ProductDetail;