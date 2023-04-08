import { auth, storage } from '../../firebase/config';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Spinning } from '../../animation-loading';
import { SET_DISPLAY_NAME } from '../../redux-toolkit/slice/authSlice';
import UploadSquare from '../../components/admin/addProduct/UploadSquare';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';

const InfoAccount = () => {
  const isGoogleUser = localStorage.getItem('isGoogleUser') === 'true' ? true : false
  //khi reload cần thời gian xác thực xem có đăng nhập hay không thì mới trả về current đc nha
  const currentUser = auth.currentUser;
  let checkInputDone = {
    name: false,
    imgAvatar: false,
    password: false,
    passwordError: false
  }

  const [loading, setLoading] = useState(false);
  const [haveChangeImg, setHaveChangeImg] = useState(false);
  const displayEmail = useSelector(state => state.auth.email) || localStorage.getItem('displayEmail')
  const displayName = useSelector(state => state.auth.userName) || localStorage.getItem('displayName')
  // const isGoogleUser = useSelector(state => state.auth.isGoogleUser)
  const dispatch = useDispatch()

  const [fileImg, setFileImg] = useState('')

  const avatar = localStorage.getItem('imgAvatar'); //link avt tren github

  // src này `CHỈ ĐỂ KHI MỞ ẢNH MỚI` lên thì nó hiện trong khung, không liên quan gì đến firebase
  //khi reload lại thì phải lấy ảnh trong firebase hiển thị vì cái src này k có tác dụng với internet
  //cái link này không có tác dụng xem trên internet, base64 j đó k nhớ :V thích thì console.log ra mà nhìn
  const [src, setSrc] = useState({
    imgAvatar: "",
  })

  //đây là src ảnh trên firebase
  const [infoChange, setInfoChange] = useState({
    imgAvatar: "",
    name: displayName,
    password: "",
    newPassword: "",
    newPassword2: ""
  })

  const updateInfoChange = (e) => {
    setInfoChange({
      ...infoChange,
      [e.target.name]: e.target.value
    })
  }

  //kiểm tra đầu vào có đúng chưa, nếu ok hết thì mới cho submit
  const checkInvalidUser = (e) => {
    //Check tên trước, nếu hợp lệ thì mới check 3 ô input password
    if (!(infoChange.name.length >= 5 && infoChange.name.length <= 20)) {
      return {
        notify: "Tên hiển thị phải dài từ 5 đến 20 ký tự",
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
        notify: "Thông tin tài khoản đã được cập nhật",
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
    //reset value về ô trống
    console.log('reset');
    setInfoChange({
      ...infoChange,
      password: "",
      newPassword: "",
      newPassword2: ""
    })
  }

  //XỬ LÍ KHI ĐĂNG KÍ THÌ UPLOAD AVATAR DEFAULT LUÔN CHO NHANH
  //LÚC XỬ LÍ CÁI BÌNH LUẬN, NẾU USER NÀO CHƯA CÓ AVATAR THÌ DÙNG CÁI ẢNH DEFAULT AVATAR NHƯ TRÊN FAFCEBOOK

  //sovle việc cập nhật avatar của user trên firebase
  //chỉ khi nào ấn cập nhật thì mới up ảnh lên firebase nhé :v tẹo về xử lí nốt că thằng add product
  const handleUpdateAvatar = () => {
    //nếu có thay đổi avatar (kéo vào ảnh mới thì mới xử lí)
    if (haveChangeImg) {
      const storageRef = ref(storage, `shoesPlus-avatar/${Date.now()}${fileImg.name}`);
      const uploadTask = uploadBytesResumable(storageRef, fileImg);

      //xử lí việc nếu chọn 1 ảnh khác thì phải xóa ảnh cũ đi
      // if ((infoChange.imgAvatar || avatar) && haveChangeImg && avatar !== 'avt-google') {
      //   const desertRef = ref(storage, (infoChange.imgAvatar || avatar));
      //   deleteObject(desertRef).then(() => {
      //     console.log('xoa anh thanh cong');
      //     setHaveChangeImg(false)
      //   }).catch((error) => {
      //     console.log(error.message);
      //     console.log('xoa anh that bai');
      //   });
      // }
      uploadTask.on('state_changed',
        (snapshot) => { },
        (e) => {
          toast.error(e.message, {
            autoClose: 1200
          })
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            //mục đích lưu vào local strogate để khi reload lại nó hiển thị luôn mà không cần tgian load cái ảnh => gây mất thiện cảm người dùng
            //downloadURL là link của ảnh trên firebase
            localStorage.setItem('imgAvatar', downloadURL);
            updateProfile(currentUser, { photoURL: downloadURL })
            setInfoChange(prevState => {
              return Object.assign({}, prevState, { imgAvatar: downloadURL });
            })
            checkInputDone.imgAvatar = true;
            setLoading(false);
            if (!checkInputDone.passwordError) {
              toast.success('Thông tin tài khoản đã được cập nhật', {
                autoClose: 1200
              })
            }
          });
        }
      );
    }
    else {
      checkInputDone.imgAvatar = true;
      setLoading(false)
      if (!checkInputDone.passwordError) {
        toast.success('Thông tin tài khoản đã được cập nhật', {
          autoClose: 1200
        })
      }

    }
  }

  //solve hiển thị và check xem có đổi avatar không
  const handleUploadAvatar = (event, fileImg, setLoading) => {
    setHaveChangeImg(true)
    setFileImg(fileImg)
  }

  //xử lí việc cập nhật display name
  const handleChangeDisplayName = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(currentUser, { displayName: infoChange.name })
        .then(() => {
          checkInputDone.name = true;

          //update displayName trên localStrogate
          localStorage.setItem('displayName', infoChange.name);
          //lí do phải dispatch SET_DISPLAY_NAME là do khi đổi tên thì nó cập nhật trên firebase ok rồi, nhưng nếu không F5 lại thì nó vẫn hiển thị trên web là tên cũ (VÌ TÊN HIỂN THỊ ĐỀU LẤY RA TỪ REDUX) nên không F5 lại thì redux không thể cập nhật tên mới ( trong onAuthStateChanged/header nhé), nên phải dispatch để nó re-render hết tất cả những thằng có dùng displayName lấy ra từ redux

          //update displayName trên redux
          dispatch(SET_DISPLAY_NAME(infoChange.name))
        })
        .catch((error) => {
          checkInputDone.name = false;
          // console.error("Thay đổi displayName thất bại:", error);
        });
    } catch (error) {
      // toast.error(error.message, {
      //   autoClose: 1200,
      // });
      setLoading(false)
    }
  }

  //xử lí việc cập nhật mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(
      user.email,
      infoChange.password
    );

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, infoChange.newPassword);
      checkInputDone.password = true;
    } catch (error) {
      checkInputDone.passwordError = true;
      toast.error('Mật khẩu hiện tại không đúng', {
        autoClose: 1200,
      });
      setLoading(false)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    const { notify, status, changePass } = checkInvalidUser();

    if (!status && !changePass) {
      toast.error(notify, {
        autoClose: 1500,
      });
      setLoading(false);
    }

    //change displayName nhưng KHÔNG CHANGE PASSWORD
    else if (status && !changePass) {
      await handleChangeDisplayName(e);
      handleUpdateAvatar()
    }

    //CÓ CHANGE PASSWORD & update password thành công
    else if (status && changePass) {
      if (infoChange.password === infoChange.newPassword) {
        setLoading(false);
        toast.error('Mật khẩu mới không được trùng với mật khẩu hiện tại', {
          autoClose: 1200,
        });
      }
      else {
        //await để xử lí việc nếu password hiện tại không đúng thì checkInputDone.passwordError = true và nó sẽ k đổi avt và name
        await handleChangePassword(e) //update password
        if (!checkInputDone.passwordError) {
          await handleChangeDisplayName(e) //update displayName
          handleUpdateAvatar()
          resetAndUpdateInput();
        }
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
              <div className=''>
                <label className='mb-2 font-bold block'>Ảnh hiển thị</label>
                <UploadSquare
                  src={src}
                  srcURL={src.imgAvatar || localStorage.getItem('imgAvatar') || currentUser?.photoURL || ""}
                  setSrc={setSrc}
                  handleImageChange={handleUploadAvatar}
                  name='imgAvatar'
                  text='Tải lên ảnh hiển thị'
                  id='upload-avatar'
                  width='w-[222px]' />
                <span className='block mt-2 text-[#353535] text-[16px] italic'>Ảnh sẽ được tự động cắt theo hình tròn khi tải lên</span>
              </div>
              <p>
                <label className='mb-2 font-bold block' htmlFor="account_display_name">Tên hiển thị *</label>
                <input
                  // || "" là do lúc mới chạy, onAuthStateChanged để trong useEffect (nó gắn liền với dispatch active user) vì thế lúc mới chạy, thằng infoChange.name lấy ra từ redux nó bị "" và thằng localStorage.getItem('displayName') nó cũng bị null do chưa chạy đc vào useEffect(chưa render xong UI), nên cả 2 thằng đó đều falsy thì mình sẽ lấy ""
                  // CÓ BUG: Nếu xóa hết tên thì nó không bị "" , mà sẽ getItem từ localStrogate và set lại value, vì thế nếu muốn đặt tên khác thì phải copy paste vào, THÔI CHỊU KHÓ LAG 1 TÍ CŨNG ĐC :V BỎ THẰNG LOCALSTROGATE ĐI
                  // value={infoChange.name || localStorage.getItem('displayName') || ""}
                  value={infoChange?.name || localStorage.getItem('displayName') || currentUser?.displayName}
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