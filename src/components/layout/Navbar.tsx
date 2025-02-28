import { useState, useEffect } from "react";
import { Menu, ShoppingCart, Search, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCart } from "@/context/CartContext";
import { CartSidebar } from "./CartSidebar";
import { Loader } from "lucide-react";
import api from "@/api/axiosInstance";
import { useSesion } from "@/context/SesionContext";
import { RegisterDialog } from "../account/RegisterDialog";


const categories = [
  "Nuevo Ingreso",
  "Productos Ofertados",
  "Hombre",
  "Mujer",
  "Premium",
  "Accesorios",
  { label: "Mi cuenta", mobileOnly: true },
];

/**
 * Navbar Component
 */
export default function Navbar() {
  // Controls menu visibility
  const [menuOpen, setMenuOpen] = useState(false);
  // CartContext
  const { cartItems, sidebarOpen, openSidebar, closeSidebar } = useCart();
  // SesionContext
  const { openDialog, removeToken, dialogOpen, setDialogOpen, navigateTo } = useSesion();
  const [sticky, setSticky] = useState(false); // Sticky navbar
  const [loading, setLoading] = useState(false); // Controls loader acc button visibility

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  // useEffect runs when the component mounts.
  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = useNavigate();

  // account button click
  const handleAccountClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      openDialog();
      return;
    }

    setLoading(true);
    try {
      const response = await api.get("/users/me");
      if (response.status === 200) {
        navigate("/profile");
      }
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        removeToken();
        openDialog();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav
        className={`w-full bg-primary text-textPrimary z-50 transition-all duration-300 ${sticky ? "sticky top-0 shadow-md opacity-90 backdrop-blur-2xl" : ""
          }`}
      >
        <div className="relative flex justify-between items-center px-4 py-2">
          {/* toggle menu mobile */}
          <div className="lg:hidden">
            <Button variant="default" className="bg-primary hover:bg-primary-hover" onClick={toggleMenu}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            {/* search button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="default" className="p-1 bg-primary hover:bg-secondary-hover">
                    <Search className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Buscar</TooltipContent>
                </Tooltip>
              </TooltipProvider>
          </div>
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none text-textPrimary">
            <div className="text-2xl font-bold pointer-events-auto text-accent">Carrito :D</div>
          </div>
          <div className="flex items-center gap-1">

          {/* account button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button onClick={handleAccountClick} variant="default" className="p-1 bg-transparent hover:bg-gray-800">
                    {loading ? <Loader className="animate-spin" /> : <User className="w-5 h-5 hidden lg:block" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Cuenta</TooltipContent>
              </Tooltip>
            </TooltipProvider>

          {/* carrito button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <Button variant="default" className="p-1 bg-transparent hover:bg-gray-800"
                      onClick={() => openSidebar()}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </Button>
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>Mi Carrito</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* mobile menu */}
        <div
          className={`${menuOpen ? "block" : "hidden"} lg:flex lg:items-center lg:justify-center lg:gap-8 bg-primary w-full lg:w-auto px-4 py-3 lg:py-2 transition-all duration-300`}
        >
          {categories.map((category, index) => (
            typeof category === "string" ? (
              <Button
                key={index}
                variant="default"
                className="p-1 bg-transparent hover:bg-gray-800"
                onClick={() => {
                  navigate("/");
                  closeMenu();
                }}
              >
                {category}
              </Button>
            ) : (
              <div
                key={index}
                className={`w-full lg:w-auto ${category.mobileOnly ? "block lg:hidden" : ""}`}
              >
                {/* Dropdown Button (Profile) - mobile only */}
                <Button
                  variant="default"
                  className="p-1 bg-transparent hover:bg-gray-800"
                  onClick={() => { handleAccountClick(); closeMenu(); }}
                >
                  {category.label}
                </Button>
              </div>
            )
          ))}
        </div>
      </nav >

      <CartSidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />
      <RegisterDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen}  navigateTo={navigateTo}/>
    </>

  );
}
