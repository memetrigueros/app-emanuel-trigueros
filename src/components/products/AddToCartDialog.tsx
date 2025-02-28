import React from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Heart, Loader } from "lucide-react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

/**
 * Dialog to Display Product Details and Add to Cart
 * @param {Object} props - Component Properties
 * @param {Product} props.product - Product to Add
 * @param {string} props.openDialog - Controls dialog visibility
 */
export function AddToCartDialog({
  product,
  setOpenDialog,
  openDialog
}: {
  product: Product;
  setOpenDialog: (value: boolean) => void;
  openDialog: boolean;
}) {
  // quantity of products
  const [quantity, setQuantity] = React.useState(1);
  // Controls loader "add to cart button" visibility
  const [loading, setLoading] = React.useState(false);
  // CartContext
  const { addToCart, openSidebar, closeSidebar } = useCart();

  // Change Product Quantity
  const handleQuantityChange = (type: "increment" | "decrement") => {
    setQuantity((prev) =>
      type === "increment" ? prev + 1 : prev > 1 ? prev - 1 : 1
    );
  };

  // add to cart function
  const handleAddToCart = async () => {
    setLoading(true);
    setTimeout(() => {
      const productToAdd = { ...product, quantity };
      addToCart(productToAdd);
      setLoading(false);
      setOpenDialog(false);
      closeSidebar();
      openSidebar();
    }, 1500);
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="w-full max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:rounded-lg">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* image */}
          <div className="flex flex-col lg:flex-row gap-4 max-h-96 md:max-h-[520px]">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              src={product.imageUrl}
              alt="Producto"
              className="rounded-2xl w-full object-contain max-h-96 md:max-h-[520px]"
            />
          </div>

          {/* details */}
          <div className="space-y-4">
            <h1 className="text-2xl lg:text-4xl font-semibold">{product.name}</h1>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
              <span className="text-3xl font-bold">Q{product.price}.00</span>
              <span className="line-through text-gray-400">
                Q{product.price ? product.price * 2 : 0}.00
              </span>
              <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                Descuento de 50%
              </span>
            </div>
            <div className="bg-green-100 text-green-800 p-3 rounded-xl text-sm">
              {product.description}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-xl overflow-hidden">
                <Button
                  variant="default"
                  onClick={() => handleQuantityChange("decrement")}
                >
                  <Minus />
                </Button>
                <div className="px-4 text-lg">{quantity}</div>
                <Button
                  variant="default"
                  onClick={() => handleQuantityChange("increment")}
                >
                  <Plus />
                </Button>
              </div>
            </div>

            <Button
              className="bg-[#b5a97e] text-white w-full flex justify-center items-center"
              onClick={handleAddToCart}
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin w-5 h-5" />
              ) : (
                "AÑADIR AL CARRITO"
              )}
            </Button>

            <Button className="bg-[#b5a97e] text-white w-full text-lg py-3">
              COMPRAR AHORA
            </Button>

            <div className="text-sm text-gray-600">
              <p>
                ✔️ Recogida disponible en Bodega (Normalmente está listo en 24 horas)
              </p>
              <p className="underline cursor-pointer">VER INFORMACIÓN DE LA TIENDA</p>
            </div>

            <div className="flex items-center gap-6 text-gray-500">
              <div className="flex items-center gap-1 cursor-pointer">
                <Heart className="w-5 h-5" /> Favoritos
              </div>
              <div className="cursor-pointer">🔗 Compartir</div>
            </div>

            <div className="text-xs text-gray-400">SKU: {product.id}</div>
          </div>
        </div>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
