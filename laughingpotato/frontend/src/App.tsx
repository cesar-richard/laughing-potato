import React, {lazy, Suspense, useState} from 'react';
import {createRoutesFromElements, Route, RouterProvider} from 'react-router';
import Fallback from '@sparkle/components/Fallback';
import SessionContext from '@sparkle/utils/SessionContext';
import {createBrowserRouter} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OrderSuccess = lazy(() => import('@sparkle/pages/OrderSuccess'));
const OrderList = lazy(() => import('@sparkle/pages/OrderList'));
const OrderDetail = lazy(() => import('@sparkle/pages/OrderDetail'));
const SaleDetails = lazy(() => import('@sparkle/pages/SaleDetails'));
const HomePage = lazy(() => import('@sparkle/pages/HomePage'));
const Layout = lazy(() => import('@sparkle/Layout'));
const NotFound = lazy(() => import('@sparkle/pages/NotFound'));

const App = () => {
  const [user, setUser] = useState(null);

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path="" element={<Layout />}>
      <Route path="" element={<HomePage />} />
      <Route path="sales/:slug" element={<SaleDetails />} />
      <Route path="orders" element={<OrderList />} />
      <Route path="orders/:orderId" element={<OrderSuccess />} />
      <Route path="orders/:orderId/detail" element={<OrderDetail />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ), {basename: process.env.LAUGHINGPOTATO_BASE_URL});

  return (
    <>
      <style>
        {`
      html, body {
        background-color: #362203 !important;
      }
    `}
      </style>
      <ToastContainer />
      <Suspense fallback={<Fallback />}>
        <SessionContext.Provider value={{user, updateUser: setUser}}>
          <RouterProvider router={router} fallbackElement={<Fallback />} />
        </SessionContext.Provider>
      </Suspense>
    </>
  );
};

export default App;
