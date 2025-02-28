import './App.css'
import Navbar from "@/components/layout/Navbar";
import ProductGrid from "@/components/products/ProductGrid";
import { CartProvider } from "@/context/CartContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CheckoutPage from './pages/CheckoutPage';
import { SesionProvider } from './context/SesionContext';
import ProfilePage from './pages/ProfilePage';


function App() {

  return (
    <CartProvider>
      <SesionProvider>
        <Router>
          <div className="min-h-screen">
            <Navbar />
            <Routes>
              <Route path="/" element={<ProductGrid />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </div>
        </Router>
      </SesionProvider>
    </CartProvider>
  )
}

export default App
