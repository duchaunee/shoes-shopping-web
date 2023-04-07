import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { Card, ProductItem, ValueFilter } from '..';
import NewestProduct from './NewestProduct';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase/config';
import { useDispatch, useSelector } from 'react-redux';
import { Spinning } from '../../animation-loading';
import Pagination from '../pagination/Pagination';
import OverlayLoading from '../overlayLoading/OverlayLoading';
import { selectIsAdmin } from '../../redux-toolkit/slice/authSlice';
// import OverlayLoading from '../overlayLoading/OverlayLoading';

const solvePrice = (price) => {
  return Number(price).toLocaleString('vi-VN');
}

const itemsPerPage = 8;
const quantity = 3;

const PageProducts = ({ currentName, fieldValue, STORE_NAME_PRODUCTS, selectNameProduct }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true);
  const [productDemo, setProductDemo] = useState([])
  const [productPreview, setProductPreview] = useState([])
  const [filterProduct, setFilterProduct] = useState('default');
  const [queryProduct, setQueryProduct] = useState({
    value: "latest",
    field: "price", //default la moi nhat
    order: -1
  });


  const productsCategoryRedux = useSelector(selectNameProduct) //trai, gai, tre em
  const admin = useSelector(selectIsAdmin) || JSON.parse(localStorage.getItem('admin'))

  const [currentPage, setCurrentPage] = useState(1)
  const [pageProducts, setPageProducts] = useState([]); //products every page (use slice to cut all prod

  const getProducts = async (field, fieldValue, limitNumber, detectProduct) => {
    setLoading(true)
    const productsRef = query(collection(db, "products"), where(field, "==", fieldValue));
    // const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy('creatAt', 'desc'), limit(limitNumber));
    try {
      const querySnapshot = await getDocs(q);
      const allProducts = querySnapshot.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data()
        }
      })
      //init
      if (detectProduct == 'setDemo') setProductDemo(allProducts) //demo ben trai
      if (detectProduct == 'setPreview') {
        setTimeout(() => {
          setLoading(false);
          setProductPreview(allProducts) //san pham giay nu
          setPageProducts(allProducts.slice(0, itemsPerPage))
          dispatch(STORE_NAME_PRODUCTS(allProducts))
        }, 800);
        // setLoading(false);
        // setProductPreview(allProducts) //san pham giay nu
        // setPageProducts(allProducts.slice(0, itemsPerPage))
        // dispatch(STORE_NAME_PRODUCTS(allProducts))
      }
    }
    catch (e) {
      toast.error(e.message, {
        autoClose: 1000
      })
    }
  }

  const solveQuery = (q) => {
    //1 la a[..] > b[...]
    //-1 ..
    switch (q) {
      case 'latest':
        setQueryProduct({
          value: "latest",
          field: 'creatAt',
          order: 1
        })
        break;
      case 'oldest':
        setQueryProduct({
          value: "oldest",
          field: 'creatAt',
          order: -1
        })
        break;
      case 'lowest-price':
        setQueryProduct({
          value: "lowest-price",
          field: 'price',
          order: 1
        })
        break;
      case 'highest-price':
        setQueryProduct({
          value: "highest-price",
          field: 'price',
          order: -1
        })
        break;
      case 'a-z':
        setQueryProduct({
          value: "a-z",
          field: 'name',
          order: 1
        })
        break;
      case 'z-a':
        setQueryProduct({
          value: "z-a",
          field: 'name',
          order: -1
        })
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    getProducts('category', 'giay-nu', 5, 'setDemo')
    getProducts('category', fieldValue, undefined, 'setPreview')
  }, [])

  useEffect(() => {
    if (queryProduct.value !== 'default') {
      setProductPreview([...productPreview].sort((a, b) => {
        if (a[queryProduct.field] > b[queryProduct.field]) return queryProduct.order
        return (queryProduct.order) * (-1)
      }));
    }
  }, [queryProduct])

  useEffect(() => {
    //reset init
    setCurrentPage(1)
    setQueryProduct({
      value: "default",
      field: "price",
      order: -1
    })
    //
    if (filterProduct !== 'default') {
      if (filterProduct == 'all') setProductPreview(productsCategoryRedux)
      else setProductPreview([...productsCategoryRedux].filter(item => (item.brand === filterProduct)));
    }
  }, [filterProduct])

  //có thể để bên Pagination luôn, Nhưng chỉ khi size của productPreview sau khi lọc > 8 (itemsPerPage) t mới cho hiện ra thằng Pagination :v tức là nếu size của productPreview < 8 thì sẽ không hiện Pagination và sẽ không bắt đc thời điểm productPreview thay đổi nên thôi chày cối ném sang bên này vậy :v
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, productPreview.length);
    const productsSlice = productPreview.slice(startIndex, endIndex)
    setPageProducts(productsSlice);
  }, [productPreview])

  useEffect(() => {
    if (loading) {
      window.scrollTo({
        top: 0,
      });
    }
  }, [loading])

  return (
    <>
      <div className="min-h-[800px]">
        {/* top */}
        {loading || (
          <div className=" max-w-[1230px] px-[15px] mx-auto min-h-[60px] pt-5 flex items-center justify-between">
            <div className="flex-1">
              <NavLink
                to='/'
                className='uppercase text-[18px] text-[#95959f]'>
                Trang chủ
              </NavLink>
              <div className="mx-2 inline-block">/</div>
              <span className='uppercase text-[18px] font-bold '>{currentName}</span>
            </div>
            <div className="flex items-center">
              <p className='inline-block text-[16px] text-[#353535] mr-8'>
                <span className='font-bold'>Số lượng</span>: {productPreview.length} sản phẩm
              </p>
              <select
                value={queryProduct.value}
                onChange={(e) => solveQuery(e.target.value)}
                className='outline-none mr-[12px] rounded-[4px] px-3 py-3 pr-16 text-bgPrimary cursor-pointer border-[2px] border-solid border-[#ddd] shadow-shadowSearch'
                name="sort-by" id="">
                <option key='0' value="default">Sắp xếp theo</option>
                <option key='1' value="latest">Mới nhất</option>
                <option key='2' value="oldest">Cũ nhất</option>
                <option key='3' value="lowest-price">Giá tăng dần</option>
                <option key='4' value="highest-price">Giá giảm dần</option>
                <option key='5' value="a-z">A - Z</option>
                <option key='6' value="z-a">Z - A</option>
              </select>

              <select
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className='outline-none mr-[12px] rounded-[4px] px-3 py-3 pr-16 text-bgPrimary cursor-pointer border-[2px] border-solid border-[#ddd] shadow-shadowSearch'
                name="sort-by" id="">
                <option key='0' value="default">Lọc sản phẩm theo</option>
                <option key='1' value="all">Tất cả</option>
                <option key='2' value="classic">Classic</option>
                <option key='3' value="sunbaked">Sunbaked</option>
                <option key='4' value="chuck-07s">Chuck 07S</option>
                <option key='5' value="one-star">One Star</option>
                <option key='6' value="psy-kicks">PSY Kicks</option>
              </select>
            </div>
          </div>
        )}

        {/* bot */}
        <div className="w-full">
          <div className='max-w-[1230px] min-h-[666px] pt-[30px] mx-auto flex'>
            {/* left */}
            {loading || (
              <div className='max-w-[25%] px-[15px] pb-[30px]'>
                <div className="w-full ">
                  <ValueFilter
                    productPreview={productPreview}
                    setProductPreview={setProductPreview}
                    setQueryProduct={setQueryProduct}
                    setFilterProduct={setFilterProduct}
                    selectNameProduct={selectNameProduct}
                    setCurrentPage={setCurrentPage}
                  />
                  <NewestProduct productDemo={productDemo}></NewestProduct>
                </div>
              </div>
            )}

            {/* right */}
            {loading
              ? <OverlayLoading />
              : <div className="flex-1">
                <div className={`px-[15px] ${productPreview.length > 0 && 'min-h-[555px]'} grid grid-cols-4`}>
                  {pageProducts.map((item) => (
                    <div
                      key={item.id}
                      className="w-full px-[10px] pb-5">
                      <Card width='w-full' >
                        <ProductItem
                          product={item}
                          id={item.id}
                          img={item.imgURL}
                          name={item.name}
                          price={solvePrice(item.price)}
                          idURL={fieldValue}
                          text={admin ? 'Sửa sản phẩm' : 'Thêm vào giỏ'}
                        />
                      </Card>
                    </div>
                  ))}
                </div>
                {productPreview?.length > itemsPerPage
                  && <Pagination
                    products={productPreview}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    itemsPerPage={itemsPerPage}
                    quantity={quantity}
                    setPageProducts={setPageProducts} />
                }
                {productPreview.length == 0
                  && <div className='flex flex-col items-center'>
                    <img
                      className='w-[350px] object-cover'
                      src="./notFound.jpg" alt=""
                    />
                    <h1 className='text-[26px] text-center text-bgPrimary font-mono'>Không tìm thấy sản phẩm nào</h1>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>

    </>
  );
};

export default PageProducts;