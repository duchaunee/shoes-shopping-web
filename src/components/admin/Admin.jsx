
import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavAdmin from './nav/NavAdmin';
import HomeAdmin from './home/HomeAdmin';
import ViewProducts from './viewProducts/ViewProducts';
import AddProduct from './addProduct/AddProduct';
import ViewOrders from './viewOrders/ViewOrders';

const Admin = () => {

  return (
    <div className='w-full h-full bg-white py-[35px] px-[15px]'>
      <div className="max-w-[1230px] bg-[#fff] mx-auto rounded-[12px] flex shadow-shadowAuth">
        <NavAdmin />
        {/* ////////////////////////////////////////////////////////////////////////////// */}
        <div className="rounded-tr-[12px] rounded-br-[12px] flex-shrink flex-grow px-[25px] pt-[20px] pb-5">
          <Routes>
            <Route path='' element={<HomeAdmin />} />
            <Route path='home' element={<HomeAdmin />} />
            <Route path='view-products' element={<ViewProducts />} />
            <Route path='add-product' element={<AddProduct />} />
            <Route path='view-orders' element={<ViewOrders />} />
          </Routes>
        </div>

      </div>
    </div>
  );
};

export default Admin;