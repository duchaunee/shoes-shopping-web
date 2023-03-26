import React from 'react';

const Cart = () => {
  var product = {
    src: "Model/img/sneaker.png",
    name: "Sneaker",
    value: 1120000,
    number: 2,
  }
  return (
    <div className=' flex justify-center'>
      <div className='w-[1200px] h-[1000px] flex'>
        <div className='flex-[3]  sm:border-r border-[#929292] px-3'>
          <table className='w-full mt-4'>
            <thead className=' w-full border-b-2 border-[#ececec]'>
              <tr>
                <th className='text-left'>SẢN PHẨM</th>
                <th className='text-left'>GIÁ</th>
                <th className='text-left'>SỐ LƯỢNG</th>
                <th className='text-left'>TỔNG</th>
                <th className='text-left'></th>
              </tr>
            </thead>
            <tbody className='w-full'>
              <tr className='border-b border-[#ececec] leading-[70px] text-[#000]'>
                <td className='flex'>
                  <div className='h-[70px] flex items-center'>
                    <img className='h-1/2' src={product.src} alt="" />
                  </div>
                  <p className='pl-4'>{product.name}</p>
                </td>
                <td><b>{product.value.toLocaleString()}</b></td>
                <td className=''>
                  <div className='w-20 leading-9'>
                    <button className='w-5 border boder-[#ececec]'>-</button>
                    <input name="prd_value" type="number" className='w-[40px] text-center border boder-[#ececec]' defaultValue={product.number} />
                    <button className='w-5 border boder-[#ececec]'>+</button>
                  </div>
                </td>
                <td><b>{(product.value * product.number).toLocaleString()}</b></td>
                <td className='text-xl'><button><i className="far fa-times-circle"></i></button></td>
              </tr>
            </tbody>
          </table>
          <div className='w-full whitespace-nowrap'>
            <button className='mt-3 border border-[#ea6666] rounded-full text-sm text-[#ea6666] px-4 py-2 active:scale-95'><a href="#"><i class="fas fa-arrow-left"></i> Thêm sản phẩm</a></button>
            <button className='mt-3 ml-3 rounded-full text-sm text-[#fff] px-4 py-2 bg-[#ea6666] active:scale-95'> <a href="#">Cập nhật</a></button>
          </div>
        </div>
        <div className='flex-[2] px-3 whitespace-nowrap'>
          <table className='w-full mt-4'>
            <thead className='w-full border-b-2 border-[#ececec]'>
              <tr>
                <th className='text-left'>TỔNG SỐ LƯỢNG</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b-2 border-[#ececec] leading-10'>
                <td >Tổng phụ</td>
                <td className='text-end'><b>{(product.value * product.number).toLocaleString()}đ</b></td>
              </tr>
              <tr className='border-b-2 border-[#ececec]'>
                <td >Giao hàng</td>
                <td className='text-end'>
                  <ul>
                    <li><a href="#">Giao hàng miễn phí</a></li>
                    <li>Ước tính: </li>
                    <li>
                      <label className='cursor-pointer hover:text-[#f55959]' htmlFor="">Đổi địa chỉ</label>
                      <div className='h-[250px] bg-[#cfcfcf] rounded-lg overflow-hidden transition-all ease-in-out duration-1000 '>
                        <form action="" className='px-[15px] py-2 flex flex-col items-center'>
                          <select className=' py-1 w-full border border-[#ececec] my-1' name="adress-1" >
                            <option value="" disabled selected hidden>Thành phố</option>
                            <option value="">An Giang</option>
                            <option value="">Bà Rịa - Vũng Tàu</option>
                            <option value="">Bắc Giang</option>
                            <option value="">Bắc Kạn</option>
                            <option value="">Bạc Liêu</option>
                            <option value="">Bắc Ninh</option>
                            <option value="">Bến Tre</option>
                            <option value="">Bình Định</option>
                            <option value="">Bình Dương</option>
                            <option value="">Bình Phước</option>
                            <option value="">Bình Thuận</option>
                            <option value="">Cà Mau</option>
                            <option value="">Cần Thơ</option>
                            <option value="">Cao Bằng</option>
                            <option value="">Đà Nẵng</option>
                            <option value="">Đắk Lắk</option>
                            <option value="">Đắk Nông</option>
                            <option value="">Điện Biên</option>
                            <option value="">Đồng Nai</option>
                            <option value="">Đồng Tháp</option>
                            <option value="">Gia Lai</option>
                            <option value="">Hà Giang</option>
                            <option value="">Hà Nam</option>
                            <option value="">Hà Nội</option>
                            <option value="">Hà Tĩnh</option>
                            <option value="">Hải Dương</option>
                            <option value="">Hải Phòng</option>
                            <option value="">Hậu Giang</option>
                            <option value="">Hòa Bình</option>
                            <option value="">Hưng Yên</option>
                            <option value="">Khánh Hòa</option>
                            <option value="">Kiên Giang</option>
                            <option value="">Kon Tum</option>
                            <option value="">Lai Châu</option>
                            <option value="">Lâm Đồng</option>
                            <option value="">Lạng Sơn</option>
                            <option value="">Lào Cai</option>
                            <option value="">Long An</option>
                            <option value="">Nam Định</option>
                            <option value="">Nghệ An</option>
                            <option value="">Ninh Bình</option>
                            <option value="">Ninh Thuận</option>
                            <option value="">Phú Thọ</option>
                            <option value="">Phú Yên</option>
                            <option value="">Quảng Bình</option>
                            <option value="">Quảng Nam</option>
                            <option value="">Quảng Ngãi</option>
                            <option value="">Quảng Ninh</option>
                            <option value="">Quảng Trị</option>
                            <option value="">Sóc Trăng</option>
                            <option value="">Sơn La</option>
                            <option value="">Tây Ninh</option>
                            <option value="">Thái Bình</option>
                            <option value="">Thái Nguyên</option>
                            <option value="">Thanh Hóa</option>
                            <option value="">Thừa Thiên Huế</option>
                            <option value="">Tiền Giang</option>
                            <option value="">TP. Hồ Chí Minh</option>
                            <option value="">Trà Vinh</option>
                            <option value="">Tuyên Quang</option>
                            <option value="">Vĩnh Long</option>
                            <option value="">Vĩnh Phúc</option>
                            <option value="">Yên Bái</option>
                          </select>
                          <input className='pl-1 py-1 w-full border border-[#ececec] my-1' type="text" placeholder='Huyện' />
                          <input className='pl-1 py-1 w-full border border-[#ececec] my-1' type="text" placeholder='Xã' />
                          <input className='pl-1 py-1 w-full border border-[#ececec] my-1' type="text" placeholder='Mã bưu điện' />
                          <button type='submit' className='w-[100px] py-1 mt-3 rounded-full bg-[#f55959] active:scale-95'>Cập nhật</button>
                        </form>
                      </div>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr className='border-b-2 border-[#ececec] leading-10'>
                <td >Tổng</td>
                <td className='text-end'><b>{(product.value * product.number).toLocaleString()}đ</b></td>
              </tr>
            </tbody>
          </table>
          <button className='w-full font-bold bg-[#d26e4b] text-[#fff] py-3'>THANH TOÁN</button>
          <div className='flex flex-col'>
            <div className='border-b-2 border-[#ececec] leading-10'>
              <i class="fas fa-tag fa-flip-horizontal opacity-50 text-sm"></i>
              <b>Phiếu ưu đãi</b>
            </div>
            <input className='py-2 border border-[#bfbfbf] my-1' type="text" placeholder='Mã ưu đãi' />
            <button className='py-2 border border-[#bfbfbf] hover:bg-[#afafaf]'>Áp dụng</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;