import { EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification, updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Spinning } from '../../animation-loading';
import ButtonPrimary from '../../components/button/ButtonPrimary';
import app, { auth } from '../../firebase/config';
import { SET_DISPLAY_NAME } from '../../redux-toolkit/slice/authSlice';
import firebase from 'firebase/app';

const InfoAccount = () => {

  const isGoogleUser = localStorage.getItem('isGoogleUser') === 'true' ? true : false

  const [loading, setLoading] = useState(false);
  const displayEmail = useSelector(state => state.auth.email)
  const displayName = useSelector(state => state.auth.userName)
  // const isGoogleUser = useSelector(state => state.auth.isGoogleUser)
  const dispatch = useDispatch()

  const [infoChange, setInfoChange] = useState({
    name: displayName,
    password: "",
    newPassword: "",
    newPassword2: ""
  })

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

  //kiểm tra đầu vào có đúng chưa, nếu ok hết thì mới cho submit
  const checkInvalidUser = (e) => {
    //Check tên trước, nếu hợp lệ thì mới check 3 ô input password
    if (!(/^[\p{L} ]{3,20}$/u).test(infoChange.name)) {
      return {
        notify: "Tên phải dài từ 3 đến 20 ký tự và chỉ chứa các ký tự chữ và khoảng trắng",
        status: false,
        changePass: false
      };
    }

    //check 3 ô input password
    let count = 0;
    if (infoChange.password !== "") count++;
    if (infoChange.newPassword !== "") count++;
    if (infoChange.newPassword2 !== "") count++;

    //Nếu không có ô nào được điền
    if (count == 0) {
      return {
        notify: "Tên hiển thị đã được cập nhật",
        status: true,
        changePass: false
      };
    }

    //chỉ cần điền 1 ô hoặc 2 ô thì có thông báo 'không được để trông inpout'
    if (count == 1 || count == 2) {
      return {
        notify: "Không được để trống input",
        status: false,
        changePass: false
      };
    }
    //Điền cả 3 ô, phải check điều kiện từng ô một
    else {
      if (!(/^[a-zA-Z0-9]{8,}$/).test(infoChange.newPassword)) {
        return {
          notify: "Mật khẩu mới phải dài ít nhất 8 ký tự và không chứa các ký tự đặc biệt",
          status: false,
          changePass: false
        };
      }

      if (infoChange.newPassword !== infoChange.newPassword2) {
        return {
          notify: "Mật khẩu mới không chính xác",
          status: false,
          changePass: false
        };
      }
      //Nếu cả 3 thằng điền hợp lệ
      // handleChangePassword(e)
      return {
        notify: "Thông tin tài khoản đã được cập nhật",
        status: true,
        changePass: true
      };
    }
  }

  //khi cập nhật phải reset các ô input và update các thông tin, mở ra để đọc
  const resetAndUpdateInput = () => {
    setLoading(false);

    //reset value về ô trống
    setInfoChange({
      ...infoChange,
      password: "",
      newPassword: "",
      newPassword2: ""
    })

    //update displayName trên localStrogate
    localStorage.setItem('displayName', infoChange.name);
    //lí do phải dispatch SET_DISPLAY_NAME là do khi đổi tên thì nó cập nhật trên firebase ok rồi, nhưng nếu không F5 lại thì nó vẫn hiển thị trên web là tên cũ (VÌ TÊN HIỂN THỊ ĐỀU LẤY RA TỪ REDUX) nên không F5 lại thì redux không thể cập nhật tên mới ( trong onAuthStateChanged/header nhé), nên phải dispatch để nó re-render hết tất cả những thằng có dùng displayName lấy ra từ redux

    //update displayName trên redux
    dispatch(
      SET_DISPLAY_NAME(infoChange.name)
    )
  }

  //xử lí việc cập nhật display name
  //openToast = true là hiện lên thông báo thay đổi tên thành công
  //openToast = false là xử lí TH update cả password, thì cái này không toast 'thay đổi tên thành công' mà chỉ hiện 'Cập nhật thông tin thành công'
  const handleChangeDisplayName = (notify, openToast = true, resetAndUpdate = true) => {
    setLoading(true);
    var currentUser = auth.currentUser;
    updateProfile(currentUser, { displayName: infoChange.name })
      .then(() => {
        if (resetAndUpdate) resetAndUpdateInput()
        if (openToast) {
          toast.success(notify, {
            autoClose: 1200,
          });
        }
      })
      .catch((error) => {
        // console.error("Thay đổi displayName thất bại:", error);
      });
  }

  //XEM CÁCH ĐỔI MẬT KHẨU MÀ VIẾT TRONG HÀM NÀY NHÉ :V
  //xử lí việc cập nhật mật khẩu
  const handleChangePassword = async (e, notify) => {
    e.preventDefault();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user.email,
      infoChange.password
    );

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, infoChange.newPassword);
      toast.success(notify, {
        autoClose: 1200,
      });
      resetAndUpdateInput()
    } catch (error) {
      toast.error('Mật khẩu hiện tại không đúng', {
        autoClose: 1200,
      });
      setLoading(false)
      // console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault()

    const { notify, status, changePass } = checkInvalidUser();
    if (!status && !changePass) {
      toast.error(notify, {
        autoClose: 1500,
      });
    }

    //change displayName nhưng không change password
    if (status && !loading && !changePass) {
      handleChangeDisplayName(notify);
    }

    //update password thành công
    if (status && !loading && changePass) {
      setLoading(true);
      if (infoChange.password === infoChange.newPassword) {
        setLoading(false);
        toast.error('Mật khẩu mới không được trùng với mật khẩu hiện tại', {
          autoClose: 1200,
        });
      }

      else {
        handleChangeDisplayName(notify, false, false) //update displayName
        handleChangePassword(e, notify) //update password
      }
    }
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
                  // CÓ BUG: Nếu xóa hết tên thì nó không bị "" , mà sẽ getItem từ localStrogate và set lại value, vì thế nếu muốn đặt tên khác thì phải copy paste vào, THÔI CHỊU KHÓ LAG 1 TÍ CŨNG ĐC :V BỎ THẰNG LOCALSTROGATE ĐI
                  // value={infoChange.name || localStorage.getItem('displayName') || ""}
                  value={infoChange.name || ""}
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