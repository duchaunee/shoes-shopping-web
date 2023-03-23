import React, { useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Outlet, Route, Routes } from 'react-router-dom';
import { Contact } from '..';
import Home from '../home/Home';

const Cart = () => {
  return (
    <>
      <NavLink
        to="contact"
        className='outline-none border-[2px] bg-green-800 text-white rounded-md p-5'>
        Click
      </NavLink>

      <Routes>
        <Route path="/cart/contact" element={<Contact />} />
      </Routes>
      <Outlet />
    </>
  );
};

export default Cart;