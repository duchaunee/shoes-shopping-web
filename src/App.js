import React, { useState } from 'react';
import './index.scss' //tailwindcss
import './App.css' //reset css

import { Header, Footer, Auth, Admin } from "./components"
import { Home, GirlShoes, BoyShoes, ChildShoes, Page404, ProductDetail, Cart, CheckOut, CheckoutSuccess } from './pages';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import InfoAccount from './pages/infoAccount/InfoAccount';
import { PermissionDenied } from './components/admin';
import OverlayProduct from './pages/productDetail/OverlayProduct';

//LƯU Ý: đang set height cho body là 300vh để xuất hiện thanh scroll
const App = () => {
  const [logined, setLogined] = useState(localStorage.getItem('logined') === 'true' ? true : false)
  // const admin = localStorage.getItem('admin') === 'true' ? true : false
  const [admin, setAdmin] = useState(localStorage.getItem('admin') === 'true' ? true : false)

  const [isGoogleUser, setIsGoogleUser] = useState(localStorage.getItem('isGoogleUser') === 'true' ? true : false)

  return (
    <>
      <BrowserRouter>
        <ToastContainer style={{
          zIndex: 999999
        }} />
        <Header logined={logined} setLogined={setLogined} admin={admin} setAdmin={setAdmin} isGoogleUser={isGoogleUser} setIsGoogleUser={setIsGoogleUser} />

        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path='/dang-nhap' element={logined ? <Navigate to="/" /> : <Auth />} />;
          <Route path='/tai-khoan' element={logined ? <InfoAccount /> : <Navigate to="/dang-nhap" />} />;

          <Route path="/gioi-thieu" element={<h2>GIOI THIEU</h2>}></Route>
          <Route path="/giay-nu" element={<GirlShoes></GirlShoes>}></Route>
          <Route path="/giay-nam" element={<BoyShoes></BoyShoes>}></Route>
          <Route path="/giay-tre-em" element={<ChildShoes></ChildShoes>}></Route>
          <Route path="/tin-tuc" element={<h2>TIN TỨC</h2>}></Route>
          <Route path="/lien-he" element={<h2>LIÊN HỆ</h2>}></Route>

          <Route path='/admin/*' element={admin ? <Admin /> : <PermissionDenied />} />
          <Route path="/san-pham/:id" element={<ProductDetail></ProductDetail>}></Route>
          <Route path='/gio-hang' element={logined ? <Cart /> : <Navigate to="/dang-nhap" />} />
          <Route path="/thanh-toan" element={<CheckOut></CheckOut>}></Route>
          <Route path="/order-received" element={<CheckoutSuccess></CheckoutSuccess>}></Route>

          <Route path="/*" element={<Page404></Page404>}></Route>
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  )
};

export default App;
