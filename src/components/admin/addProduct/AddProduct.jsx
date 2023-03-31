import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Spinning } from '../../../animation-loading';
import { db, storage } from '../../../firebase/config';
import InputForm from '../../inputForm/InputForm';
import UploadSquare from './UploadSquare';

const AddProduct = () => {
  const initializeFireBase = {
    name: "",
    imgURL: "",
    price: 0,
    category: "", //neu khong chon thi de default la giay nam
    brand: "", //neu khong chon thi de default la Classic
    desc: "",
    //day la link img tren firebase, khong phai link img khi upload len giao dien
    imgPreviewURL1: "",
    imgPreviewURL2: "",
    imgPreviewURL3: "",
    imgPreviewURL4: "",
  }

  //src đây là link ảnh, tại sao phải để ở thằng cha là vì khi thêm sản phẩm xong, phải setSrc về rỗng để ảnh ở trong khung biến mất
  const initializeSrc = {
    imgURL: null,
    imgPreviewURL1: null,
    imgPreviewURL2: null,
    imgPreviewURL3: null,
    imgPreviewURL4: null,
  }

  const [loading, setLoading] = useState(false);
  const [src, setSrc] = useState(initializeSrc)
  const [product, setProduct] = useState(initializeFireBase)

  const handleInputChange = (e) => {
    e.preventDefault()
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    })
  }

  //Khi 1 ảnh được mở lên, thì sẽ tải ảnh đó lên Strogate của firebase để khi thực hiện thao tác "Thêm sản phẩm" thì ảnh sản phẩm sẽ đc kéo ra từ trong Strogate của firebase đó
  //NHƯNG CÓ 1 VẤN ĐỀ LÀ: bug memory leak: Chọn 1 ảnh ok rồi, nhưng khi chọn qua ảnh khác, thì ảnh 1 không bị xóa bởi firebase mà nó sẽ lấy cả 2 ảnh 
  const handleImageChange = (event, fileImg, setLoading) => {
    const storageRef = ref(storage, `shoesPlus/${Date.now()}${fileImg.name}`);
    const uploadTask = uploadBytesResumable(storageRef, fileImg);

    uploadTask.on('state_changed',
      (snapshot) => {//process ( % tien trinh load xong img )
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (progress === 100) setLoading(false) //nếu chưa tải xong ảnh thì loading vẫn quay
        else setLoading(true)
      },
      (e) => {
        toast.error(e.message, {
          autoClose: 1200
        })
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

          //dùng Object.assign chỉ để ghi đè thuộc tính mong muốn mà không cần rải state cũ như dòng 87
          setProduct(prevState => {
            return Object.assign({}, prevState, { [event.target.name]: downloadURL });
          })
          // setProduct({
          //   ...product,
          //   [event.target.name]: downloadURL
          // })
        });
      }
    );
  }

  //Khi ấn "Thêm sản phẩm" thì sẽ tải sản phẩm đó lên firebase ở trong firestore database, còn các link ảnh là do nó kéo từ bên Strogate của firebase mà ở handleImageChange function đã xử lí
  const handleAddProduct = (e) => {
    e.preventDefault()
    setLoading(true)
    // Add a new document with a generated id.
    try {
      const docRef = addDoc(collection(db, "products"), {
        name: product.name,
        imgURL: product.imgURL,
        price: Number(product.price),
        category: product.category,
        brand: product.brand,
        desc: product.desc,
        imgPreviewURL1: product.imgPreviewURL1,
        imgPreviewURL2: product.imgPreviewURL2,
        imgPreviewURL3: product.imgPreviewURL3,
        imgPreviewURL4: product.imgPreviewURL4,
        creatAt: Timestamp.now().toDate()
      });

      setLoading(false)
      setProduct(initializeFireBase)
      setSrc(initializeSrc);

      toast.success("Thêm sản phẩm thành công", {
        autoClose: 1200
      })

    } catch (e) {
      toast.error(e.message, {
        autoClose: 1200
      })
    }
    console.log(product);
  }

  return (
    <>
      <form
        onSubmit={handleAddProduct}
        className="w-full">
        <div className="w-full flex gap-6">
          <div className="w-1/2 flex flex-col gap-6">
            <InputForm
              onChange={handleInputChange}
              name='name'
              value={product.name}
              type='input'
              typeInput='input'
              width='w-full'
              bg='bg-white'
              labelName='Tên sản phẩm'
              placeholder='Nhập vào tên sản phẩm'
              id='product-name' />
            <div className="w-full flex gap-6">
              <UploadSquare
                src={src}
                srcURL={src.imgURL}
                setSrc={setSrc}
                handleImageChange={handleImageChange}
                name='imgURL'
                text='Tải lên ảnh sản phẩm'
                id='upload-product'
                width='w-1/2' />

              <div className="w-1/2 flex flex-col gap-6 flex-1 justify-center">
                <InputForm
                  onChange={handleInputChange}
                  value={product.price}
                  type='input'
                  numberType='number'
                  width='w-full'
                  name='price'
                  bg='bg-white'
                  labelName='Giá'
                  placeholder='Giá sản phẩm'
                  id='product-price' />
                <InputForm
                  onChange={handleInputChange}
                  type='select'
                  value={product.category}
                  width='w-full'
                  bg='bg-white'
                  name='category'
                  labelName='Loại'
                  placeholder='Loại sản phẩm'
                  id='product-category'>
                  <option key='0' value="choose">Chọn loại sản phẩm</option>
                  <option key='1' value="giay-nam">Giày nam</option>
                  <option key='2' value="giay-nu">Giày nữ</option>
                  <option key='3' value="giay-tre-em">Giày trẻ em</option>
                </InputForm>
                <InputForm
                  onChange={handleInputChange}
                  type='select'
                  width='w-full'
                  value={product.brand}
                  bg='bg-white'
                  name='brand'
                  labelName='Thương hiệu'
                  placeholder='Thương hiệu sản phẩm'
                  id='product-brand'>
                  <option key='0' value="choose">Chọn thương hiệu</option>
                  <option key='1' value="classic">Classic</option>
                  <option key='2' value="sunbaked">Sunbaked</option>
                  <option key='3' value="chuck-07s">Chuck 07S</option>
                  <option key='4' value="one-star">One Star</option>
                  <option key='5' value="psy-kicks">PSY Kicks</option>
                </InputForm>
              </div>
            </div>

            <InputForm
              onChange={handleInputChange}
              type='textarea'
              width='w-full'
              value={product.desc}
              bg='bg-white'
              name='desc'
              labelName='Mô tả sản phẩm'
              placeholder='Nhập vào mô tả sản phẩm'
              id='product-desscription' />
          </div>

          <div className="w-1/2 grid grid-cols-2 gap-5 aspect-square ">
            <UploadSquare
              src={src}
              srcURL={src.imgPreviewURL1}
              setSrc={setSrc}
              handleImageChange={handleImageChange}
              name='imgPreviewURL1'
              text='Tải lên ảnh preview'
              id='product-preview-1' />
            <UploadSquare
              src={src}
              srcURL={src.imgPreviewURL2}
              setSrc={setSrc}
              handleImageChange={handleImageChange}
              name='imgPreviewURL2'
              text='Tải lên ảnh preview'
              id='product-preview-2' />
            <UploadSquare
              src={src}
              srcURL={src.imgPreviewURL3}
              setSrc={setSrc}
              handleImageChange={handleImageChange}
              name='imgPreviewURL3'
              text='Tải lên ảnh preview'
              id='product-preview-3' />
            <UploadSquare
              src={src}
              srcURL={src.imgPreviewURL4}
              setSrc={setSrc}
              handleImageChange={handleImageChange}
              name='imgPreviewURL4'
              text='Tải lên ảnh preview'
              id='product-preview-4' />
          </div>
        </div>
        <button
          type="submit"
          className='mt-[20px] w-[180px] px-[10px] h-10 bg-primary text-white text-[15px] leading-[37px] font-bold tracking-[1px] uppercase transition-transform ease-in duration-500 focus:outline-none hover:bg-[#a40206]'>
          {loading ? <Spinning /> : "Thêm sản phẩm"}
        </button>
      </form>

    </>
  );
};

export default AddProduct;