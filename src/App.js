
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
import React, { useEffect, useRef } from 'react';
import './index.scss' //tailwindcss
import './App.css' //reset css

import { Cascade, Spinning } from './animation-loading';

import { Header, Footer, ProductItem, Card, Auth } from "./components"
import { Home, Contact, Login, Cart, Admin, Checkout, Product, ProductCategory } from './pages';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';

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
  return (
    <>
      <BrowserRouter>
        <Header />
        {/* <Card><ProductItem /></Card>
        <Card><ProductItem /></Card> */}
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/tai-khoan" element={<Auth />}></Route>
          <Route path="/gioi-thieu" element={<h2>GIOI THIEU</h2>}></Route>
          <Route path="/giay-nu" element={<h2>GIÀY NỮ</h2>}></Route>
          <Route path="/giay-nam" element={<h2>GIÀY NAM</h2>}></Route>
          <Route path="/giay-tre-em" element={<h2>GIÀY TRẺ EM</h2>}></Route>
          <Route path="/tin-tuc" element={<h2>TIN TỨC</h2>}></Route>
          <Route path="/lien-he" element={<h2>LIÊN HỆ</h2>}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
};

export default App;
