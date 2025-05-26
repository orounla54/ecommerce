import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, Menu, User, Search, LogOut, ChevronDown } from 'lucide-react';
import { useLogoutMutation } from '../../store/slices/usersApiSlice';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import SearchBox from '../SearchBox';
import { useGetCategoriesQuery } from '../../store/slices/categoriesApiSlice';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  
  const { cartItems } = useSelector((state: RootState) => state.cart);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  
  const { data: categories } = useGetCategoriesQuery({});

  const logoutHandler = async () => {
    try {
      await logoutApiCall({}).unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (categoryMenuOpen) setCategoryMenuOpen(false);
  };

  const toggleCategoryMenu = () => {
    setCategoryMenuOpen(!categoryMenuOpen);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary flex items-center">
            <span>TytyShop</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <button 
                className="flex items-center text-secondary hover:text-primary"
                onClick={toggleCategoryMenu}
              >
                Categories <ChevronDown size={16} className="ml-1" />
              </button>
              
              {categoryMenuOpen && (
                <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  {categories?.map((category) => (
                    <Link
                      key={category._id}
                      to={`/products/category/${category._id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setCategoryMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link to="/products" className="text-secondary hover:text-primary">
              All Products
            </Link>
            
            <button onClick={toggleSearch} className="text-secondary hover:text-primary">
              <Search size={20} />
            </button>
            
            <Link to="/cart" className="text-secondary hover:text-primary relative">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>
            
            {userInfo ? (
              <div className="relative group">
                <button className="flex items-center text-secondary hover:text-primary">
                  {userInfo.name} <ChevronDown size={16} className="ml-1" />
                </button>
                <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </Link>
                  {userInfo.isAdmin && (
                    <>
                      <Link to="/admin/productlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Products
                      </Link>
                      <Link to="/admin/orderlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Orders
                      </Link>
                      <Link to="/admin/userlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Users
                      </Link>
                      <Link to="/admin/categorylist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Categories
                      </Link>
                    </>
                  )}
                  <button
                    onClick={logoutHandler}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="text-secondary hover:text-primary flex items-center">
                <User size={20} className="mr-1" /> Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="text-secondary hover:text-primary relative">
              <ShoppingCart size={20} />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>
            
            <button 
              onClick={toggleSearch}
              className="text-secondary hover:text-primary"
            >
              <Search size={20} />
            </button>
            
            <button
              onClick={toggleMobileMenu}
              className="text-secondary hover:text-primary"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Search Box */}
        {searchVisible && (
          <div className="py-3 border-t">
            <SearchBox />
          </div>
        )}
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t">
            <nav className="flex flex-col space-y-3 pb-3">
              <Link 
                to="/"
                className="text-secondary hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              <div>
                <button 
                  onClick={toggleCategoryMenu}
                  className="flex items-center w-full text-left text-secondary hover:text-primary py-2"
                >
                  Categories <ChevronDown size={16} className="ml-1" />
                </button>
                
                {categoryMenuOpen && (
                  <div className="pl-4 flex flex-col space-y-2 mt-2">
                    {categories?.map((category) => (
                      <Link
                        key={category._id}
                        to={`/products/category/${category._id}`}
                        className="text-secondary hover:text-primary py-1"
                        onClick={() => {
                          setCategoryMenuOpen(false);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link 
                to="/products"
                className="text-secondary hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </Link>
              
              {userInfo ? (
                <>
                  <Link 
                    to="/profile"
                    className="text-secondary hover:text-primary py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  
                  {userInfo.isAdmin && (
                    <>
                      <Link 
                        to="/admin/productlist"
                        className="text-secondary hover:text-primary py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Products
                      </Link>
                      <Link 
                        to="/admin/orderlist"
                        className="text-secondary hover:text-primary py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Orders
                      </Link>
                      <Link 
                        to="/admin/userlist"
                        className="text-secondary hover:text-primary py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Users
                      </Link>
                      <Link 
                        to="/admin/categorylist"
                        className="text-secondary hover:text-primary py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Categories
                      </Link>
                    </>
                  )}
                  
                  <button
                    onClick={() => {
                      logoutHandler();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center text-secondary hover:text-primary py-2"
                  >
                    <LogOut size={18} className="mr-1" /> Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login"
                  className="flex items-center text-secondary hover:text-primary py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={18} className="mr-1" /> Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;