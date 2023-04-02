import { getAuth } from 'firebase/auth';
import React, { useEffect } from 'react';
import { Card, ProductItem } from '../../components';
import Admin from '../../components/admin/Admin';
import app, { firebaseConfig } from '../../firebase/config';

const Home = () => {

  return (
    <div className=''>
      <Card><ProductItem></ProductItem></Card>
    </div>
  );
};

export default Home;