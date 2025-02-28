import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { useSesion } from "@/context/SesionContext";

/**
 * Component for Cart Control: "Sidebar"
 * @param {Object} props - Component Properties
 * @param {boolean} props.sidebarOpen - Controls sidebar visibility (open)
 * @param {boolean} props.closeSidebar - Controls sidebar visibility (close)
 */
export function CartSidebar({ sidebarOpen, closeSidebar }: { sidebarOpen: boolean; closeSidebar: () => void }) {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const navigate = useNavigate();

  const { openDialog, setNavigateTo } = useSesion();

  const handleQuantityChange = (id: string, type: "increment" | "decrement") => {
    updateQuantity(id, type);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // go to checkout
  const handlePayClick = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      // route to visit after authentication
      setNavigateTo("/checkout");
      // register and login dialog
      openDialog();
      closeSidebar()
      return;
    }
    navigate("/checkout");
    closeSidebar()
  };

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black opacity-90 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
          />
          <motion.div
            className="fixed right-0 top-0 w-full sm:w-96 h-full bg-white shadow-lg z-50 overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4 }}
          >

            <div className="absolute inset-0 flex flex-col sm:flex-col justify-between gap-4 h-full">
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-semibold">🛒 Carrito :D</h2>
              <Button variant="default" onClick={closeSidebar}>
                <X className="w-6 h-6" />
              </Button>
            </div>
              <div className="overflow-y-auto flex-1 w-full px-4 space-y-4">
                {cartItems.length === 0 ? (
                  <p className="text-center text-gray-500">🛒 Tu carrito está vacío.</p>
                ) : (
                  cartItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-center justify-between border rounded p-3 gap-4"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 ml-3">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-sm text-gray-500">Q{item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, "decrement")}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="text-sm font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, "increment")}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Button variant="outline" onClick={() => removeFromCart(item.id)}>
                        Eliminar
                      </Button>
                    </div>
                  ))
                )}
              </div>
              <div className="sticky bottom-0 bg-white z-10 p-4 border-t w-full space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal:</span>
                  <span>Q{subtotal.toFixed(2)}</span>
                </div>
                <Button
                  onClick={() => {
                    handlePayClick();
                  }}
                  className="w-full bg-green-600 text-white hover:bg-green-700 py-3 text-lg"
                >
                  Proceder a pagar
                </Button>
              </div>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
