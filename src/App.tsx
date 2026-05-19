import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { StoreProvider } from './context/StoreContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Brands from './pages/Brands';
import About from './pages/About';
import Contact from './pages/Contact';
import Invoice from './pages/Invoice';
import VerifyEmail from './pages/VerifyEmail';
import { useStore } from './context/StoreContext';
import { useLocation, Navigate } from 'react-router-dom';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useStore();
  const location = useLocation();

  if (user && !user.emailVerified && location.pathname !== '/verify-email') {
    return <Navigate to="/verify-email" replace />;
  }

  if (user && user.emailVerified && location.pathname === '/verify-email') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useStore();
  const isVerifyPage = useLocation().pathname === '/verify-email';

  return (
    <div className="flex flex-col min-h-screen">
      {!isVerifyPage && <Header />}
      <main className="flex-grow">{children}</main>
      {!isVerifyPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <StoreProvider>
        <BrowserRouter>
          <AuthGuard>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={
                  <RequireAuth>
                    <Cart />
                  </RequireAuth>
                } />
                <Route path="/admin" element={
                  <RequireAuth>
                    <Admin />
                  </RequireAuth>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                } />
                <Route path="/brands" element={<Brands />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/admin/invoice/:id" element={<Invoice />} />
              </Routes>
            </Layout>
          </AuthGuard>
        </BrowserRouter>
      </StoreProvider>
    </HelmetProvider>
  );
}
