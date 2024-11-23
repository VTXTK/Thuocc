import React, { useEffect } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import ProductPage from './pages/product';
import ContactPage from './pages/contact';
import LoginPage from './pages/login';
import { Outlet } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import RegisterPage from './pages/register';
import { callFetchAccount } from './services/api';
import { useDispatch, useSelector } from 'react-redux';
import { doGetAccountAction } from './features/account/accountSlice';
import Loading from './components/Loading';
import NotFound from './components/NotFound';
import AdminPage from './pages/admin';
import ProtectedRoute from './components/ProtectedRoute';
import LayoutAdmin from './components/Admin/LayoutAdmin';
import './styles/reset.scss';
import './styles/global.scss';
//import UserTable from './components/Admin/User/userTable';
import CusTable from './components/Admin/User/CustomerTable'
import ProductTable from './components/Admin/Product/ProductTable'
import OrderPage from './pages/order/order';
import OrderTable from './components/Admin/Order/OrderTable'
import HistoryOrderPage from './pages/history/historyOrder';
import ViewDetailHistoryPage from './pages/history/viewDetailHistory';
const Layout = () => {
  return (
    <div className='layout-app'>
      <div className='Header'><Header /></div>
      <div className='Outlet' ><Outlet /></div>
      <div><Footer /></div>

    </div>
  )
}

export default function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate
  const isLoading = useSelector(state => state.account.isLoading)

  const getAccount = async () => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
      return;

    const res = await callFetchAccount();
    if (res && res.data) {
      dispatch(doGetAccountAction(res.data.user))
    }
  }
  useEffect(() => {
    getAccount();
  }, [])

  const router = createBrowserRouter([

    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home />, },
        {
          path: "product/:slug",
          element: <ProductPage />
        },
        {
          path: "order",
          element: <OrderPage />
        },
        {
          path: "history",
          element: <HistoryOrderPage />
        },
        {
          path: "detailHistory",
          element: <ViewDetailHistoryPage />
        }
      ],
    },

    {
      path: "/admin",
      element: <ProtectedRoute>
        <LayoutAdmin />
      </ProtectedRoute>,
      errorElement: <NotFound />,
      children: [
        {
          index: true, element:
            <ProtectedRoute>
              <AdminPage />
            </ProtectedRoute>
        },
        {
          path: "customer",
          element: <ProtectedRoute>
            <CusTable />
          </ProtectedRoute>,
        },
        {
          path: "product",
          element:
            <ProtectedRoute>
              <ProductTable />
            </ProtectedRoute>,
        },
        {
          path: "order",
          element: <ProtectedRoute>
            <OrderTable />
          </ProtectedRoute>,
        }
      ],
    },


    {
      path: "/login",
      element: <LoginPage />,
    },

    {
      path: "/register",
      element: <RegisterPage />,
    },

  ]);

  return (
    <>
      {
        isLoading === false
          || window.location.pathname === '/login'
          || window.location.pathname === '/register'
          || window.location.pathname === '/'
          || window.location.pathname.match(/^\/product\/.+/)
          ?
          <RouterProvider router={router} />
          :
          <Loading />
      }
    </>
  )
}
