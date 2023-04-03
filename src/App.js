
// const App = () => {
//   console.log('re-render');
//   const [nextPage, setNextPage] = useState(1)

//   const handleLog = () => {
//     setNextPage(nextPage + 1)
//     console.log('after setState');
//   }

//   return (
//     <>
//       <button onClick={handleLog} className='border text-orange-600 border-[#333] px-5 m-5'>Click</button>
//     </>
//   );
// };


// const App = () => {
//   const [show, setShow] = useState(true)
//   useEffect(() => {
//     return () => {
//       // console.log('cleanup function');
//     }
//   }, [])
//   return (
//     <>
//       {/* <Header></Header> */}
//       {show && <Child></Child>}
//       <button onClick={() => setShow(!show)} className='m-10 outline-none px-5 py-3 rounded-md bg-emerald-500 text-white font-normal'>Show Child</button>
//     </>
//   )
// }

// const Child = () => {
//   let navDot = useRef([])
//   useEffect(() => {
//     console.log(navDot.current);

//   }, [])
//   return (
//     <div className="w-[500px] h-[100px] flex mt-[10px] bg-gray-600" >
//       <label htmlFor="img-1" className="nav-dot-active nav-dot rounded-[5px] mx-[2px] bg-black cursor-pointer transition-all duration-700 ease-in-out" id="img-dot-1"></label>
//       <label htmlFor="img-2" className="nav-dot rounded-[5px] mx-[2px] bg-black cursor-pointer transition-all duration-700 ease-in-out" id="img-dot-2"></label>
//       <label htmlFor="img-3" className="nav-dot rounded-[5px] mx-[2px] bg-black cursor-pointer transition-all duration-700 ease-in-out" id="img-dot-3"></label>
//     </div >
//   )
// }
//==============================================================================
// const Child = () => {
//   const count1 = useSelector(state => state.counter.count)
//   return (
//     <h2 className='max-w-max mx-auto text-[30px] text-green-500 font-medium mb-5'>{count1}</h2>
//   )
// }

// const App = () => {
//   const count = useSelector(state => state.counter.count)
//   const dispatch = useDispatch()
//   const handleIncrement = () => {
//     dispatch(decrement(5))
//   }

//   const handleDecrement = () => {
//     dispatch(increment(5))
//   }

//   return (
//     <div className='m-20 max-w-[400px] mx-auto border  p-5 shadow-2xl'>
//       <Child></Child>
//       <h2 className='max-w-max mx-auto text-[30px] text-green-500 font-medium mb-5'>{count}</h2>
//       <div className="flex justify-center gap-x-5">
//         <button onClick={handleIncrement} className='transition-all duration-500 hover:bg-green-600 hover:shadow-2xl outline-none border-[2px] bg-green-500 rounded-lg px-4 py-3 text-white text-[20px]'>
//           Decreament
//         </button>
//         <button onClick={handleDecrement} className='transition-all duration-500 hover:bg-green-600 hover:shadow-2xl outline-none border-[2px] bg-green-500 rounded-lg px-4 py-3 text-white text-[20px]'>
//           Increament
//         </button>
//       </div>
//     </div>
//   )
// };
import React, { useState } from 'react';
import './index.scss' //tailwindcss
import './App.css' //reset css

import { Header, Footer, ProductItem, Card, Auth, Admin } from "./components"
import { Home, Contact, Login, Cart, Checkout, Product, ProductCategory, GirlShoes, BoyShoes, ChildShoes } from './pages';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import { ToastContainer } from 'react-toastify';
import InfoAccount from './pages/infoAccount/InfoAccount';
import { PermissionDenied } from './components/admin';
import HomeAdmin from './components/admin/home/HomeAdmin';

// const Child = () => {
//   console.log('re-render child');
//   const inc = useSelector(count)
//   const dispatch = useDispatch();

//   return (
//     <>
//       <h1>{inc}</h1>
//       <button
//         onClick={() => dispatch(increment(7))}
//         className='m-5 outline-none rounded-lg px-5 py-3 border bg-green-600 text-white '>Click child</button>
//     </>
//   )
// }

//LƯU Ý: đang set height cho body là 300vh để xuất hiện thanh scroll
const App = () => {
  const [logined, setLogined] = useState(localStorage.getItem('logined') === 'true' ? true : false)
  // const admin = localStorage.getItem('admin') === 'true' ? true : false
  const [admin, setAdmin] = useState(localStorage.getItem('admin') === 'true' ? true : false)

  const [isGoogleUser, setIsGoogleUser] = useState(localStorage.getItem('isGoogleUser') === 'true' ? true : false)

  return (
    <>
      <BrowserRouter>
        <ToastContainer />
        <Header logined={logined} setLogined={setLogined} admin={admin} setAdmin={setAdmin} isGoogleUser={isGoogleUser} setIsGoogleUser={setIsGoogleUser} />

        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path='/dang-nhap' element={logined ? <Navigate to="/" /> : <Auth />} />;
          <Route path='/tai-khoan' element={logined ? <InfoAccount /> : <Navigate to="/" />} />;
          {/* Lam them trang "quyen han bi tu choi khi vao /admin bang khach hang" */}

          <Route path="/gioi-thieu" element={<h2>GIOI THIEU</h2>}></Route>
          <Route path="/giay-nu" element={<GirlShoes></GirlShoes>}></Route>
          <Route path="/giay-nam" element={<BoyShoes></BoyShoes>}></Route>
          <Route path="/giay-tre-em" element={<ChildShoes></ChildShoes>}></Route>
          <Route path="/tin-tuc" element={<h2>TIN TỨC</h2>}></Route>
          <Route path="/lien-he" element={<h2>LIÊN HỆ</h2>}></Route>

          <Route path='/admin/*' element={admin ? <Admin /> : <PermissionDenied />} />;

          <Route path="/*" element={<h2>404 page</h2>}></Route>
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  )
};

export default App;
