import React from 'react';

const ProductDetail = () => {

  // const getProducts = async (field, fieldValue, limitNumber, detectProduct) => {
  //   setLoading(true)
  //   const productsRef = query(collection(db, "products"), where(field, "==", fieldValue));
  //   // const productsRef = collection(db, "products");
  //   const q = query(productsRef, orderBy('creatAt', 'desc'), limit(limitNumber));
  //   try {
  //     const querySnapshot = await getDocs(q);
  //     const allProducts = querySnapshot.docs.map((doc) => {
  //       return {
  //         id: doc.id,
  //         ...doc.data()
  //       }
  //     })
  //     //init
  //     if (detectProduct == 'setDemo') setProductDemo(allProducts) //demo ben trai
  //     if (detectProduct == 'setPreview') {
  //       setTimeout(() => {
  //         setLoading(false);
  //         setProductPreview(allProducts) //san pham giay nu
  //         setPageProducts(allProducts.slice(0, itemsPerPage))
  //         dispatch(STORE_NAME_PRODUCTS(allProducts))
  //       }, 800);
  //     }
  //   }
  //   catch (e) {
  //     toast.error(e.message, {
  //       autoClose: 1000
  //     })
  //   }
  // }

  return (
    <>
      <div className="w-full h-[300px]">
        <div className="w-full h-full py-10">
          <div className="max-w-[1230px] h-full mx-auto flex">
            {/* left */}
            <div className="flex-1 px-[15px]">

            </div>

            {/* right */}
            <div className="flex-1 px-[15px] pt-[10px] pb-[30px]"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;