import { getAuth } from 'firebase/auth';
import React, { useEffect } from 'react';
import { Card, ProductItem } from '../../components';
import Admin from '../../components/admin/Admin';
import app, { firebaseConfig } from '../../firebase/config';

const Home = () => {

  return (
    <div className=''>
      <ProductItem></ProductItem>
    </div>
  );
};

export default Home;