import React, { useState } from 'react';
import { OverlayLoading } from '../../animation-loading';
import { NavLink } from 'react-router-dom';

const CheckoutSuccess = () => {
  const [loading, setLoading] = useState(false)

  const solvePrice = (price) => {
    return Number(price).toLocaleString('vi-VN');
  }

  return (
    <>
      <OverlayLoading loading={loading}>
        <div className="w-full py-[30px]">
          <div className="max-w-[1230px] mx-auto ">
            <div className="w-full px-[15px] pb-[30px]">
              <div className="w-full flex">
                <form className='w-full flex'>
                  {/* left */}
                  <div className="basis-[58.33%] pr-[30px] flex flex-col gap-6">
                    <div className="w-full">
                      <h1 className='text-[26px] text-bgPrimary font-bold'>Chi tiết đơn hàng</h1>
                      <div className="">
                        <div className="flex justify-between uppercase font-bold border-[3px] border-transparent border-b-[#ececec]">
                          <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Sản phẩm</h2>
                          <h2 className='text-[14px] tracking-widest text-bgPrimary py-2'>Tổng</h2>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <NavLink
                            to='/dakjk'
                            className='text-[#334862] text-[14px] cursor-pointer'>Chuck Taylor All Star Simple Step Summer Fundamentals
                            <strong className='text-bgPrimary font-blod ml-1 text-[14px]'>× 1</strong>
                          </NavLink>
                          <h2 className='font-bold inline-block text-[14px]'>
                            30.000 ₫
                          </h2>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Tổng phụ</h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            30.000 ₫
                          </h2>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Phương thức thanh toán</h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            Trả tiền mặt khi nhận hàng
                          </h2>
                        </div>
                        <div className="flex justify-between text-[14px] py-2 border border-transparent border-b-[#ddd]">
                          <h2 className=''>Tổng cộng</h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            1.600.000 ₫
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="w-full">
                      <h1 className='text-[26px] text-bgPrimary font-bold'>Địa chỉ giao hàng</h1>
                      <div className="">
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Tỉnh / Thành phố
                          </h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            Bắc Ninh
                          </h2>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Quận / Huyện
                          </h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            Quế Võ
                          </h2>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Phường / Xã
                          </h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            Ngọc Xá
                          </h2>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Địa chỉ cụ thể
                          </h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            Hữu Bằng - Ngọc Xá - Quế Võ - Bắc Ninh
                          </h2>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Số điện thoại
                          </h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            0912332132
                          </h2>
                        </div>
                        <div className="flex justify-between py-2 border border-transparent border-b-[#ddd]">
                          <h2 className='text-[14px]'>Ghi chú
                          </h2>
                          <h2 className='font-bold inline-block text-[14px]'>
                            <p className='italic'>Không có ghi chú</p>
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* right */}
                  <div className='self-start flex-1 py-6 bg-[#fafafa] shadow-md px-[30px] border-[2px] border-solid'>
                    <strong className='text-[#7a9c59] font-bold block mb-5'>Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được nhận</strong>
                    <ul className=''>
                      <li className='flex mb-3'>
                        <p className='mr-1'>Ngày:</p>
                        <strong> 15 Tháng Tư, 2023</strong>
                      </li>
                      <li className='flex mb-3'>
                        <p className='mr-1'>Tên hiển thị:</p>
                        <strong> Đỗ Đức Hậu</strong>
                      </li>
                      <li className='flex mb-3'>
                        <p className='mr-1'>Email:</p>
                        <strong>duchaunee@gmail.com</strong>
                      </li>
                      <li className='flex mb-3'>
                        <p className='mr-1'>Tổng cộng:</p>
                        <strong>1.600.000 ₫</strong>
                      </li>
                      <li className='flex mb-3'>
                        <p className='mr-1'>Phương thức thanh toán:</p>
                        <strong>Trả tiền mặt khi nhận hàng</strong>
                      </li>
                    </ul>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div >
      </OverlayLoading>
    </>
  );
};

export default CheckoutSuccess;