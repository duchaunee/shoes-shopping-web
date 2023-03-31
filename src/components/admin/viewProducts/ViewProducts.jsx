import { faEdit, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Spinning } from '../../../animation-loading';
import { db } from '../../../firebase/config';
import "./lineClamp.scss"
import Pagination from '../../pagination/Pagination';

const ViewProducts = () => {
  const itemsPerPage = 4;

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]); //all products

  const [currentPage, setCurrentPage] = useState(1)
  const [pageProducts, setPageProducts] = useState([]); //products every page (use slice to cut all products)

  const getProducts = async () => {
    setLoading(true)
    // const productsRef = query(collection(db, "products"), where("name", "==", 'Chuck Taylor All'));
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("creatAt"));
    try {
      const querySnapshot = await getDocs(q);
      const allProducts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }))

      //init
      setProducts(allProducts)
      setPageProducts(allProducts.slice(0, itemsPerPage))
      setLoading(false)
    }
    catch (e) {
      toast.error(e.message, {
        autoClose: 1200
      })
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
    return Math.floor(price).toLocaleString('en-US').replace(',', '.');
  }

  useEffect(() => {
    getProducts()
    // console.log(solveCategory('giay-nam'));
    // console.log(solvePrice(12500000));
  }, [])

  return (
    <>
      <div className='w-full'>
        <div className={`border border-transparent pb-6 border-b-bgPrimary flex items-center justify-between ${loading && 'mb-[80px]'}`}>
          <span className='text-bgPrimary flex-1 text-[18px]'>
            <p className='font-bold inline-block text-[18px]'>Số lượng</p>
            : {products.length} sản phẩm
          </span>
          <div className="flex-1 px-[15px] overflow-hidden inline-flex gap-2 items-center border border-solid border-bgPrimary rounded-[4px]">
            <FontAwesomeIcon icon={faSearch} />
            <input
              className='block flex-1 py-[6px] text-[18px] text-bgPrimary outline-none'
              placeholder='Tìm kiếm theo tên'
              autoComplete='off'
              type="text" name="" id="" />
          </div>
          <div className="flex-1 ">
            <select
              className='outline-none mr-[12px] float-right rounded-[4px] bg-slate-100 px-3 py-3 text-bgPrimary cursor-pointer  shadow-sm'
              name="sort-by" id="">
              <option key='0' value="">Sắp xếp theo</option>
              <option key='1' value="latest">Mới nhất</option>
              <option key='2' value="lowest-price">Giá tăng dần</option>
              <option key='3' value="highest-price">Giá giảm dần</option>
              <option key='4' value="a-z">A - Z</option>
              <option key='5' value="z-a">Z - A</option>
            </select>
          </div>
        </div>

        <div
          style={{
            height: `${itemsPerPage * 148 + 44}px`
          }}
          className="w-full mt-10 text-bgPrimary">
          {loading
            ? <Spinning color='#1f2028' size='32px' />
            : (
              <table className='w-full'>
                <thead>
                  <tr
                    className='grid gap-6 grid-cols-12 mb-4 text-[18px] font-bold py-2'>
                    <td className='col-span-1'>Thứ tự</td>
                    <td className='col-span-5'>Thông tin sản phẩm</td>
                    <td className='col-span-2'>Phân loại</td>
                    <td className='col-span-2'>Giá</td>
                    <td className='col-span-2'>Thao tác</td>
                  </tr>
                </thead>
                <tbody>
                  {pageProducts.map((product, idx) => (
                    <tr
                      key={product.id}
                      className='grid gap-6 grid-cols-12 mb-4 rounded-[4px] py-4 shadow-md'>
                      <td className='col-span-1 flex items-center justify-center'>
                        <span className='text-[18px] font-medium'>
                          {(idx + 1) + itemsPerPage * (currentPage - 1)}
                        </span>
                      </td>
                      <td className='col-span-5 flex gap-4'>
                        {console.log(product.imgURL)}
                        <img
                          className='rounded-[4px] h-[100px] object-cover'
                          src={product.imgURL} alt="" />
                        <div className="flex flex-col mt-4">
                          <span className='text-[20px] font-medium text-bgPrimary line-clamp-1'>{product.name}</span>
                          <span className='text-[#888] line-clamp-2'>{product.desc}</span>
                        </div>
                      </td>
                      <td className='col-span-2 flex items-center'>
                        <span className='text-[18px] bg-[#d9d6d6] rounded-[4px] px-2 py-1'>{solveCategory(product.category)}</span>
                      </td>
                      <td className='col-span-2 flex items-center'>
                        <span className='text-[18px] font-medium'>{solvePrice(product.price)} ₫</span>
                      </td>
                      <td className='col-span-2 flex items-center gap-5'>
                        <FontAwesomeIcon className='text-[20px] cursor-pointer text-bgPrimary' icon={faEdit} />
                        <FontAwesomeIcon className='text-[20px] cursor-pointer text-bgPrimary' icon={faTrashAlt} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
        </div>

        {!loading &&
          (<div className="">
            <Pagination
              products={products}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setPageProducts={setPageProducts} />
          </div>)
        }

      </div>
    </>
  );
};

export default ViewProducts;