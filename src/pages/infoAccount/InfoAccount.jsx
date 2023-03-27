import { sendEmailVerification, updateEmail, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Spinning } from '../../animation-loading';
import ButtonPrimary from '../../components/button/ButtonPrimary';
import { auth } from '../../firebase/config';

const InfoAccount = () => {
  const [loading, setLoading] = useState(false);
  const displayEmail = useSelector(state => state.auth.email)
  const displayName = useSelector(state => state.auth.userName)

  const [infoChange, setInfoChange] = useState({
    name: displayName,
    password: "",
  })
  // const checkInvalidUser = () => {
  //   if (!(/^[a-zA-Z\s]{3,16}$/).test(regInfo.username)) {
  //     return {
  //       notify: "Username phải dài từ 3 đến 16 ký tự và chỉ chứa các ký tự chữ và khoảng trắng",
  //       status: false,
  //     };
  //   }
  //   if (!(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(regInfo.email)) {
  //     return {
  //       notify: "Hãy nhập đúng định dạng email",
  //       status: false,
  //     };
  //   }
  //   // 
  //   if (!(/^[a-zA-Z0-9]{8,}$/).test(regInfo.password)) {
  //     return {
  //       notify: "Password phải dài ít nhất 8 ký tự và không chứa các ký tự đặc biệt",
  //       status: false,
  //     };
  //   }
  //   return {
  //     notify: "Sign up success",
  //     status: true,
  //   };
  // }
  useEffect(() => {
    setInfoChange({
      ...infoChange,
      name: displayName,
    })
  }, [displayName])

  const updateInfoChange = (e) => {
    setInfoChange({
      ...infoChange,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true);
    var currentUser = auth.currentUser;
    //update displayName
    updateProfile(currentUser, { displayName: infoChange.name })
      .then(() => {
        setLoading(false);
        // console.log("Thay đổi displayName thành công!");
      })
      .catch((error) => {
        // console.error("Thay đổi displayName thất bại:", error);
      });

    // send email to verify
    // sendEmailVerification(currentUser)
    //   .then(() => {
    //     console.log("Vui lòng kiểm tra email để nhận đường link xác thực");
    //   })
    //   .catch(function (error) {
    //     console.log(error.message);
    //   })

    toast.success('Thông tin tài khoản đã được cập nhật', {
      autoClose: 1200,
    });
  }

  return (
    <>
      <div className="my-[30px] max-w-[1230px] mx-auto">
        <div className="px-[15px]">
          <form onSubmit={handleSubmit}>

            <div className="w-full mb-12 text-[#222] text-[14px] flex flex-col gap-5 ">
              <span className='text-[#353535] block text-[16px] font-bold uppercase '>Thông tin tài khoản</span>
              <p>
                <label className='mb-2 font-bold block' htmlFor="account_display_name">Tên hiển thị *</label>
                <input
                  value={infoChange.name}
                  onChange={(e) => updateInfoChange(e)}
                  name="name"
                  className='align-middle bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' id='account_display_name' type="text" />
                <span className='text-[#353535] text-[16px] italic'>Đây sẽ là cách mà tên của bạn sẽ được hiển thị trong phần tài khoản và trong phần đánh giá</span>
              </p>

              <p>
                <label className='mb-2 font-bold block'>Địa chỉ email *</label>
                <input
                  name="email"
                  autoComplete="off"
                  placeholder={displayEmail}
                  className='align-middle pointer-events-none bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                <span className='text-[#353535] text-[16px] italic'>Bạn không thể thay đổi email</span>
              </p>
            </div>

            <div className="w-full text-[#222] text-[14px] flex flex-col gap-5">
              <span className='text-[#353535] block text-[16px] font-bold uppercase '>Thay đổi mật khẩu</span>
              <p>
                <label className='mb-2 font-bold block' htmlFor="password_current">Mật khẩu hiện tại (bỏ trống nếu không đổi)</label>
                <input
                  autoComplete="off"
                  name="password"
                  className=' align-middle bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2'
                  id='password_current'
                  type="password" />
              </p>

              <p>
                <label className='mb-2 font-bold block' htmlFor="password_1">Mật khẩu mới (bỏ trống nếu không đổi)</label>
                <input
                  autoComplete="off"
                  className='align-middle bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2'
                  id='password_1'
                  type="password" />
              </p>

              <p>
                <label className='mb-2 font-bold block' htmlFor="password_2">Xác nhận mật khẩu mới</label>
                <input
                  autoComplete="off"
                  className='align-middle bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2'
                  id='password_2'
                  type="password" />
              </p>
            </div>

            <button
              type="submit"
              className='mt-[20px] w-[150px] h-10 bg-primary text-white text-[15px] leading-[37px] font-bold tracking-[1px] uppercase transition-transform ease-in delay-[80ms] focus:outline-none'>
              {loading ? <Spinning /> : "Lưu thay đổi"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default InfoAccount;