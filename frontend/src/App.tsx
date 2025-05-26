import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import ProfilePage from './pages/ProfilePage';
import ProductsPage from './pages/ProductsPage';
import CategoryPage from './pages/CategoryPage';

// Admin Pages
import AdminOrderListPage from './pages/admin/OrderListPage';
import AdminProductListPage from './pages/admin/ProductListPage';
import AdminProductEditPage from './pages/admin/ProductEditPage';
import AdminUserListPage from './pages/admin/UserListPage';
import AdminUserEditPage from './pages/admin/UserEditPage';
import AdminCategoryListPage from './pages/admin/CategoryListPage';
import AdminCategoryEditPage from './pages/admin/CategoryEditPage';

// Route Protection
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-6 mt-16">
        <div className="container mx-auto px-4">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/page/:pageNumber" element={<ProductsPage />} />
            <Route path="/products/search/:keyword" element={<ProductsPage />} />
            <Route path="/products/search/:keyword/page/:pageNumber" element={<ProductsPage />} />
            <Route path="/products/category/:id" element={<CategoryPage />} />
            <Route path="/products/category/:id/page/:pageNumber" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Private Routes */}
            <Route path="" element={<PrivateRoute />}>
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/placeorder" element={<PlaceOrderPage />} />
              <Route path="/order/:id" element={<OrderPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="" element={<AdminRoute />}>
              <Route path="/admin/orderlist" element={<AdminOrderListPage />} />
              <Route path="/admin/productlist" element={<AdminProductListPage />} />
              <Route path="/admin/productlist/:pageNumber" element={<AdminProductListPage />} />
              <Route path="/admin/product/:id/edit" element={<AdminProductEditPage />} />
              <Route path="/admin/userlist" element={<AdminUserListPage />} />
              <Route path="/admin/user/:id/edit" element={<AdminUserEditPage />} />
              <Route path="/admin/categorylist" element={<AdminCategoryListPage />} />
              <Route path="/admin/category/:id/edit" element={<AdminCategoryEditPage />} />
            </Route>
          </Routes>
        </div>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;