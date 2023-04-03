import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, ProductItem, ValueFilter } from '..';
import NewestProduct from './NewestProduct';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase/config';
import { useDispatch, useSelector } from 'react-redux';
import { STORE_GIRL_PRODUCTS, selectGirlProducts } from '../../redux-toolkit/slice/productSlice';
import { Spinning } from '../../animation-loading';
import Pagination from '../pagination/Pagination';

const solvePrice = (price) => {
  return Math.floor(price).toLocaleString('en-US')
}

const itemsPerPage = 8;
const quantity = 3;

const PageProducts = ({ currentName, fieldValue }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const [productDemo, setProductDemo] = useState([])
  const [productPreview, setProductPreview] = useState([])
  const [queryProduct, setQueryProduct] = useState({
    field: "price", //default la moi nhat
    order: -1
  });
  // const girlProduct = useSelector(selectGirlProducts)

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
        setLoading(false);
        setProductPreview(allProducts) //san pham giay nu
        setPageProducts(allProducts.slice(0, itemsPerPage))
        dispatch(STORE_GIRL_PRODUCTS(allProducts))
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
          field: 'creatAt',
          order: -1
        })
        break;
      case 'oldest':
        setQueryProduct({
          field: 'creatAt',
          order: 1
        })
        break;
      case 'lowest-price':
        setQueryProduct({
          field: 'price',
          order: 1
        })
        break;
      case 'highest-price':
        setQueryProduct({
          field: 'price',
          order: -1
        })
        break;
      case 'a-z':
        setQueryProduct({
          field: 'name',
          order: 1
        })
        break;
      case 'z-a':
        setQueryProduct({
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
    // setLoading(true)
    setProductPreview([...productPreview].sort((a, b) => {
      if (a[queryProduct.field] > b[queryProduct.field]) return queryProduct.order
      return (queryProduct.order) * (-1)
    }));
  }, [queryProduct])

  //có thể để bên Pagination luôn, Nhưng chỉ khi size của productPreview sau khi lọc > 8 (itemsPerPage) t mới cho hiện ra thằng Pagination :v tức là nếu size của productPreview < 8 thì sẽ không hiện Pagination và sẽ không bắt đc thời điểm productPreview thay đổi nên thôi chày cối ném sang bên này vậy :v
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, productPreview.length);
    const productsSlice = productPreview.slice(startIndex, endIndex)
    setPageProducts(productsSlice);
  }, [productPreview])

  return (
    <>
      <div className="max-w-[1230px] px-[15px] mx-auto min-h-[60px] pt-5 flex items-center justify-between">
        <div className="flex-1">
          <NavLink className='uppercase text-[18px] text-[#95959f]'>Trang chủ</NavLink>
          <div className="mx-2 inline-block">/</div>
          <span className='uppercase text-[18px] font-bold '>{currentName}</span>
        </div>
        <div className="flex items-center">
          <p className='inline-block text-[16px] text-[#353535] mr-8'>
            <span className='font-bold'>Số lượng</span>: {productPreview.length} sản phẩm
          </p>
          <select
            onChange={(e) => solveQuery(e.target.value)}
            className='outline-none mr-[12px] rounded-[4px] px-3 py-3 pr-16 text-bgPrimary cursor-pointer border-[2px] border-solid border-[#ddd] shadow-shadowSearch'
            name="sort-by" id="">
            <option key='0' value="">Sắp xếp theo</option>
            <option key='1' value="latest">Mới nhất</option>
            <option key='2' value="oldest">Cũ nhất</option>
            <option key='3' value="lowest-price">Giá tăng dần</option>
            <option key='4' value="highest-price">Giá giảm dần</option>
            <option key='5' value="a-z">A - Z</option>
            <option key='6' value="z-a">Z - A</option>
          </select>
        </div>
      </div>

      <div className="w-full">
        <div className='max-w-[1230px] min-h-[666px] pt-[30px] mx-auto flex'>
          <div className='max-w-[25%] px-[15px] pb-[30px]'>
            <div className="w-full ">
              <ValueFilter
                productPreview={productPreview}
                setProductPreview={setProductPreview}
              />
              {loading
                ? <Spinning color='#1f2028' size='32px' mt='mt-[100px]' />
                : <NewestProduct productDemo={productDemo}></NewestProduct>
              }
            </div>
          </div>

          {loading
            ? <Spinning color='#1f2028' size='32px' mt='mt-[150px]' />
            : <div className="flex-1">
              <div className="px-[15px] grid grid-cols-4">
                {pageProducts.map((item) => (
                  <div
                    key={item.id}
                    className="w-full px-[10px] pb-5">
                    <Card width='w-full' >
                      <ProductItem
                        img={item.imgURL}
                        name={item.name}
                        price={solvePrice(item.price)}
                        text='Thêm vào giỏ'
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
                    src="./no-product-found.jpg" alt=""
                  />
                  <h1 className='text-[22px] text-center text-bgPrimary'>Không tìm thấy sản phẩm nào :(</h1>
                </div>

              }
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default PageProducts;