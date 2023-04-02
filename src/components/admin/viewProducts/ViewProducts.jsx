import { faEdit, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Spinning } from '../../../animation-loading';
import { db, storage } from '../../../firebase/config';
import Pagination from '../../pagination/Pagination';
import { NavLink } from 'react-router-dom';
import { deleteObject, ref } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import Notiflix from 'notiflix';
import { STORE_PRODUCTS, selectProducts } from '../../../redux-toolkit/slice/productSlice';
import "./lineClamp.scss"

const ViewProducts = () => {
  const itemsPerPage = 3;

  const [loading, setLoading] = useState(false);
  const [queryProduct, setQueryProduct] = useState({
    field: "creatAt", //default la moi nhat
    order: 'desc'
  });
  const [notFound, setNotFound] = useState(false);
  const [searchByName, setSearchByName] = useState('');
  const [products, setProducts] = useState([]); //all products

  const [currentPage, setCurrentPage] = useState(1)
  const [pageProducts, setPageProducts] = useState([]); //products every page (use slice to cut all products)
  const dispatch = useDispatch();
  const productsRedux = useSelector(selectProducts)

  const getProducts = async () => {
    setLoading(true)
    // const productsRef = query(collection(db, "products"), where("name", "==", 'Chuck Taylor All'));
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy(queryProduct.field, queryProduct.order));
    try {
      const querySnapshot = await getDocs(q);
      const allProducts = querySnapshot.docs.map((doc) => {
        const productItem = Object.assign({}, doc.data(), { creatAt: doc.data().creatAt.toString() })
        return {
          id: doc.id,
          ...productItem
        }
      })
      //init
      setProducts(allProducts)
      setPageProducts(allProducts.slice(0, itemsPerPage))
      setLoading(false)
      //save products to redux
      dispatch(STORE_PRODUCTS(allProducts))
      localStorage.setItem('products', JSON.stringify(allProducts));
    }
    catch (e) {
      toast.error(e.message, {
        autoClose: 1000
      })
    }
  }

  //...img này bao gồm 1 img và 4 img preview
  const confirmDelete = (id, ...img) => {
    Notiflix.Confirm.show(
      'Xóa sản phẩm',
      'Bạn có muốn xóa sản phẩm này ?',
      'Xóa',
      'Hủy bỏ',
      function okCb() {
        handleDeleteProduct(id, img)
      },
      function cancelCb() {
        console.log();
      },
      {
        zindex: 2000,
        width: '320px',
        fontFamily: 'Roboto',
        borderRadius: '4px',
        titleFontSize: '20px',
        titleColor: '#c30005',
        messageFontSize: '18px',
        cssAnimationDuration: 300,
        cssAnimationStyle: 'zoom',
        buttonsFontSize: '16px',
        okButtonBackground: '#c30005',
        cancelButtonBackground: '#a5a3a3',
        backgroundColor: '##d8d8d8',
        backOverlayColor: 'rgba(0,0,0,0.4)',
      },
    );
  }

  const handleDeleteProduct = async (id, img) => {
    try {
      //delete product
      await deleteDoc(doc(db, "products", id));
      //delete image (neu co anh thi moi xoa, co TH add product nhung k add anh)
      if (img) {
        img.forEach(async (item) => {
          const desertRef = ref(storage, item);
          await deleteObject(desertRef)
        })
      }
      //set lai product
      const newProducts = products.filter(product => product.id !== id)
      setProducts(newProducts);

      //set lai pageProduct (vì mình dùng pagination nên phải set lại cả cái này)
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = Math.min(startIndex + itemsPerPage, newProducts.length);
      //Nếu chỉ có 1 sản phẩm ở 1 trang, nếu xóa sản phẩm đó đi thì currentPage phải bị giảm đi 1
      if (startIndex > newProducts.length - 1) setCurrentPage(currentPage - 1)
      setPageProducts(newProducts.slice(startIndex, endIndex));

      toast.success('Xóa sản phẩm thành công', {
        autoClose: 1000
      })
    } catch (e) {
      toast.error(e.message, {
        autoClose: 1000
      })
      // toast.error('Sản phẩm đã bị xóa', {
      //   autoClose: 1000
      // })
    }
  }

  const handleSearchByName = () => {
    const searchProducts = productsRedux.filter(product => product.name.toLowerCase().includes(searchByName))
    setLoading(true)
    //vì thằng getProducts là async nên chưa kịp get về thì nó đã chạy handleSearchByName rồi nên phải có điều kiện products.length !== 0 (sản phẩm đâ được get về)
    if (searchProducts.length === 0 && products.length !== 0) {
      setNotFound(true)
      return;
    }
    //Có 2 TH searchByName bị rỗng: 1 là khi mới vào thì searchByName == "", 2 là khi nhập xong xóa thì searchByName == ""
    // 1. Nếu sản phẩm đã get về thành công và nhập vào ô search by name, mà có searchProducts.length > 0 thì hiển thị
    // 2. Nếu sản phẩm đã get về thành công và nhập vào ô search by name XONG XÓA đi làm cho ô search bị rỗng, mà có searchProducts.length > 0 thì hiển thị
    else if (searchByName !== "" && products.length !== 0 && searchProducts.length > 0
      || (searchByName === "" && searchProducts.length > 0)) {
      setNotFound(false)
      setLoading(false)
      setProducts(searchProducts)
      setPageProducts(searchProducts.slice(0, itemsPerPage))
    }
  }

  const solveQuery = (q) => {
    switch (q) {
      case 'latest':
        setQueryProduct({
          field: 'creatAt',
          order: 'desc'
        })
        break;
      case 'oldest':
        setQueryProduct({
          field: 'creatAt',
          order: 'asc'
        })
        break;
      case 'lowest-price':
        setQueryProduct({
          field: 'price',
          order: 'asc'
        })
        break;
      case 'highest-price':
        setQueryProduct({
          field: 'price',
          order: 'desc'
        })
        break;
      case 'a-z':
        setQueryProduct({
          field: 'name',
          order: 'asc'
        })
        break;
      case 'z-a':
        setQueryProduct({
          field: 'name',
          order: 'desc'
        })
        break;
      default:
        break;
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
    getProducts() //async
  }, [queryProduct])

  useEffect(() => {
    handleSearchByName() //thằng này sẽ chạy trước getProducts()
  }, [searchByName])

  return (
    <>
      <div className='w-full'>
        <div className={`border border-transparent pb-6 border-b-bgPrimary flex items-center justify-between ${loading && 'mb-[80px]'}`}>
          <span className='text-bgPrimary flex-1 text-[18px]'>
            <p className='font-bold inline-block text-[18px]'>Số lượng</p>
            : {notFound ? "0" : products.length} sản phẩm
          </span>
          <div className="flex-1 px-[15px] overflow-hidden inline-flex gap-2 items-center border border-solid border-bgPrimary rounded-[4px]">
            <FontAwesomeIcon icon={faSearch} />
            <input
              value={searchByName}
              onChange={(e) => setSearchByName(e.target.value)}
              className='block flex-1 py-[6px] text-[18px] text-bgPrimary outline-none'
              placeholder='Tìm kiếm theo tên'
              autoComplete='off'
              type="text" name="" id="" />
          </div>
          <div className="flex-1 ">
            <select
              onChange={(e) => solveQuery(e.target.value)}
              className='outline-none mr-[12px] float-right rounded-[4px] bg-slate-100 px-3 py-3 text-bgPrimary cursor-pointer  shadow-sm'
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

        {
          notFound
            ? <h1 className='text-[20px] text-center mt-20'>
              Không có sản phẩm nào cho tìm kiếm "{searchByName}"
            </h1>
            : <>
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
                            <td className='col-span-5 grid grid-cols-7 gap-4'>
                              <img
                                className='col-span-3 rounded-[4px] h-[100px] w-full object-cover'
                                src={product.imgURL} alt="" />
                              <div className="col-span-4 flex flex-col mt-4">
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
                              <NavLink to={`/admin/add-product/${product.id}`}>
                                <FontAwesomeIcon className='text-[20px] cursor-pointer text-bgPrimary hover:text-green-600 transition-all ease-linear duration-100' icon={faEdit} />
                              </NavLink>
                              <button
                                onClick={() => confirmDelete(product.id, product.imgURL, product.imgPreviewURL1, product.imgPreviewURL2, product.imgPreviewURL3, product.imgPreviewURL4)}
                                className=''>
                                <FontAwesomeIcon className='text-[20px] cursor-pointer text-bgPrimary hover:text-primary transition-all ease-linear duration-100' icon={faTrashAlt} />
                              </button>
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
            </>
        }

      </div>
    </>
  );
};

export default ViewProducts;