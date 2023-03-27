import React from 'react';
import { Card, ProductItem } from '../../components';

const Home = () => {
  return (
    <div className='m-6'>
      <Card><ProductItem /></Card>
      <Card><ProductItem /></Card>
    </div>
  );
};

export default Home;