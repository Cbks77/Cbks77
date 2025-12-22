import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import SimpleAdminDashboard from "./pages/SimpleAdminDashboard";
import ProductForm from "./pages/ProductForm";
import PortfolioForm from "./pages/PortfolioForm";
import PageBuilder from "./pages/PageBuilder";
import CustomPageRenderer from "./pages/CustomPageRenderer";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [cartItemCount, setCartItemCount] = useState(0);
  // Initialize auth state directly from localStorage to avoid flash redirect
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuth') === 'true';
  });

  // Update cart count from localStorage
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartItemCount(count);
  };

  useEffect(() => {
    updateCartCount();
    
    // Listen for storage changes
    window.addEventListener('storage', updateCartCount);
    
    // Check for cart updates periodically
    const interval = setInterval(updateCartCount, 1000);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  const handleAddToCart = () => {
    updateCartCount();
  };

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    return isAdminAuthenticated ? children : <Navigate to="/admin" />;
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public routes with Header/Footer */}
          <Route path="/" element={
            <>
              <Header cartItemCount={cartItemCount} />
              <Home />
              <Footer />
            </>
          } />
          <Route path="/portfolio" element={
            <>
              <Header cartItemCount={cartItemCount} />
              <Portfolio />
              <Footer />
            </>
          } />
          <Route path="/shop" element={
            <>
              <Header cartItemCount={cartItemCount} />
              <Shop onAddToCart={handleAddToCart} />
              <Footer />
            </>
          } />
          <Route path="/cart" element={
            <>
              <Header cartItemCount={cartItemCount} />
              <Cart />
              <Footer />
            </>
          } />
          <Route path="/about" element={
            <>
              <Header cartItemCount={cartItemCount} />
              <About />
              <Footer />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Header cartItemCount={cartItemCount} />
              <Contact />
              <Footer />
            </>
          } />

          {/* Custom Pages Route */}
          <Route path="/page/:slug" element={
            <>
              <Header cartItemCount={cartItemCount} />
              <CustomPageRenderer />
              <Footer />
            </>
          } />

          {/* Admin routes without Header/Footer */}
          <Route path="/admin" element={<AdminLogin onLogin={setIsAdminAuthenticated} />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <SimpleAdminDashboard onLogout={setIsAdminAuthenticated} />
            </ProtectedRoute>
          } />
          <Route path="/admin/products/new" element={
            <ProtectedRoute>
              <ProductForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/products/edit/:id" element={
            <ProtectedRoute>
              <ProductForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/portfolio/new" element={
            <ProtectedRoute>
              <PortfolioForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/portfolio/edit/:id" element={
            <ProtectedRoute>
              <PortfolioForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/pages/new" element={
            <ProtectedRoute>
              <PageBuilder />
            </ProtectedRoute>
          } />
          <Route path="/admin/pages/edit/:id" element={
            <ProtectedRoute>
              <PageBuilder />
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;
