// components/Layout.js

import React from 'react';
import ToastWrapper from '@/components/ToastWrapper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
  return (
    <>
      <ToastWrapper />
      <ToastContainer />
      {children}
    </>
  );
};

export default Layout;
