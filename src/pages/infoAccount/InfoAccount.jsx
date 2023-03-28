import { sendEmailVerification, updateEmail, updateProfile } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Spinning } from '../../animation-loading';
import ButtonPrimary from '../../components/button/ButtonPrimary';
import { auth } from '../../firebase/config';
import { SET_DISPLAY_NAME } from '../../redux-toolkit/slice/authSlice';

const InfoAccount = () => {

  const isGoogleUser = localStorage.getItem('isGoogleUser') === 'true' ? true : false

  const [loading, setLoading] = useState(false);
  const displayEmail = useSelector(state => state.auth.email)
  const displayName = useSelector(state => state.auth.userName)
  // const isGoogleUser = useSelector(state => state.auth.isGoogleUser)
  const dispatch = useDispatch()

  const RefPassword = useRef()
  const RefNewPassword = useRef()
  const RefNewPassword2 = useRef()

  const [infoChange, setInfoChange] = useState({
    name: displayName,
    password: "",
    newPassword: "",
    newPassword2: ""
  })

  const checkInvalidUser = () => {
    //phai lay ra trong firebase de check nhe :V tam thoi check ltinh da
    if (!(/^[a-zA-Z0-9]{8,}$/).test(infoChange.password)) {
      return {
        notify: "Mật khẩu cũ phải dài ít nhất 8 ký tự và không chứa các ký tự đặc biệt",
        status: false,
      };
    }

    if (!(/^[a-zA-Z0-9]{8,}$/).test(infoChange.newPassword)) {
      return {
        notify: "Mật khẩu mới phải dài ít nhất 8 ký tự và không chứa các ký tự đặc biệt",
        status: false,
      };
    }

    if (infoChange.newPassword !== (infoChange.newPassword2)) {
      return {
        notify: "Mật khẩu mới không chính xác",
        status: false,
      };
    }
    // 

    return {
      notify: "Thông tin tài khoản đã được cập nhật",
      status: true,
    };
  }

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


    const { notify, status } = checkInvalidUser();
    if (!status) {
      toast.error(notify, {
        autoClose: 1500,
      });
    }

    else if (status && !loading) {
      setLoading(true);
      //update displayName
      var currentUser = auth.currentUser;
      updateProfile(currentUser, { displayName: infoChange.name })
        .then(() => {
          setLoading(false);
          toast.success(notify, {
            autoClose: 1200,
          });

          setInfoChange({
            ...infoChange,
            password: "",
            newPassword: "",
            newPassword2: ""
          })

          //lí do phải dispatch SET_DISPLAY_NAME là do khi đổi tên thì nó cập nhật trên firebase ok rồi, nhưng nếu không F5 lại thì nó vẫn hiển thị trên web là tên cũ (VÌ TÊN HIỂN THỊ ĐỀU LẤY RA TỪ REDUX) nên không F5 lại thì redux không thể cập nhật tên mới ( trong onAuthStateChanged/header nhé), nên phải dispatch để nó re-render hết tất cả những thằng có dùng displayName lấy ra từ redux
          dispatch(
            SET_DISPLAY_NAME(infoChange.name)
          )

        })
        .catch((error) => {
          // console.error("Thay đổi displayName thất bại:", error);
        });
    }

    // send email to verify
    // sendEmailVerification(currentUser)
    //   .then(() => {
    //     console.log("Vui lòng kiểm tra email để nhận đường link xác thực");
    //   })
    //   .catch(function (error) {
    //     console.log(error.message);
    //   })
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
                  // || "" là do lúc mới chạy, onAuthStateChanged để trong useEffect (nó gắn liền với dispatch active user) vì thế lúc mới chạy, thằng infoChange.name lấy ra từ redux nó bị "" và thằng localStorage.getItem('displayName') nó cũng bị null do chưa chạy đc vào useEffect(chưa render xong UI), nên cả 2 thằng đó đều falsy thì mình sẽ lấy ""
                  value={infoChange.name || localStorage.getItem('displayName') || ""}
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
                  placeholder={displayEmail || localStorage.getItem('displayEmail') || ""}
                  className='align-middle pointer-events-none bg-white shadow-sm text-[#222] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2' type="text" />
                <span className='text-[#353535] text-[16px] italic'>Bạn không thể thay đổi email</span>
              </p>
            </div>
            {/* HIỆN ĐANG ĐĂNG NHẬP BẰNG TÀI KHOẢN GOOGLE */}
            {/* NÓ BỊ NHẤP NHÁY DO NHẢY TỪ KHÔNG ĐĂNG NHẬP BẰNG GOOGLE -> ĐĂNG NHẬP BẰNG GOOGLE */}
            {/* GIẢI QUYẾT LÀ LƯU BIẾN NÀY VÀO LOCAL STROGATE */}
            {
              isGoogleUser
                ? <div className="w-full text-[#222] text-[14px] flex flex-col gap-5">
                  <span className='text-[#353535] block text-[16px] font-bold uppercase '>Thay đổi mật khẩu</span>
                  <span className='text-[#353535] text-[16px] italic'>Bạn không thể thay đổi mật khẩu do đang đăng nhập bằng tài khoản Google</span>
                </div>
                : <div className="w-full text-[#222] text-[14px] flex flex-col gap-5">
                  <span className='text-[#353535] block text-[16px] font-bold uppercase '>Thay đổi mật khẩu</span>
                  <p>
                    <label className='mb-2 font-bold block' htmlFor="password_current">Mật khẩu hiện tại</label>
                    <input
                      ref={RefPassword}
                      autoComplete="off"
                      name="password"
                      value={infoChange.password}
                      onChange={(e) => updateInfoChange(e)}
                      placeholder='Bỏ trống nếu không đổi'
                      className='placeholder:italic align-middle bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2'
                      id='password_current'
                      type="password" />
                  </p>

                  <p>
                    <label className='mb-2 font-bold block' htmlFor="password_1">Mật khẩu mới</label>
                    <input
                      ref={RefNewPassword}
                      value={infoChange.newPassword}
                      autoComplete="off"
                      placeholder='Bỏ trống nếu không đổi'
                      name="newPassword"
                      onChange={(e) => updateInfoChange(e)}
                      className='placeholder:italic align-middle bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2'
                      id='password_1'
                      type="password" />
                  </p>

                  <p>
                    <label className='mb-2 font-bold block' htmlFor="password_2">Xác nhận mật khẩu mới</label>
                    <input
                      ref={RefNewPassword2}
                      autoComplete="off"
                      name="newPassword2"
                      value={infoChange.newPassword2}
                      onChange={(e) => updateInfoChange(e)}
                      className='align-middle bg-white shadow-sm text-[#333] w-full h-10 outline-none border border-solid border-[#ddd] text-[16px] px-3 mb-2'
                      id='password_2'
                      type="password" />
                  </p>
                </div>
            }


            <button
              type="submit"
              className='mt-[20px] w-[150px] h-10 bg-primary text-white text-[15px] leading-[37px] font-bold tracking-[1px] uppercase transition-transform ease-in duration-500 focus:outline-none hover:bg-[#a40206]'>
              {loading ? <Spinning /> : "Lưu thay đổi"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default InfoAccount;