import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const { user, loading, errorGetUser } = useUserProfile(false);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  {/* create order */}
  const handleConfirmPurchase = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      const orderData = {
        userId: user.id,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      await api.post("/orders", orderData);
      clearCart();
      navigate("/profile");
    } catch (err) {
      setError("Error al crear la orden. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
      {/* Cart Summary */}
      <div className="rounded-lg p-6 space-y-6 bg-white max-h-full">
        <h2 className="text-2xl font-semibold">🛒 Resumen del Carrito</h2>
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-500">🛒 Tu carrito está vacío.</p>
        ) : (
          <>
            <div className="max-h-96 overflow-auto" >
              {cartItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border rounded p-3 gap-4"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1 ml-3">
                    <h4 className="font-semibold text-sm">{item.name}</h4>
                    <p className="text-sm text-gray-500">Q{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Subtotal:</span>
                <span>Q{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* pay form */}
      <div className="rounded-lg p-6 bg-white space-y-6 max-h-full">
        <h2 className="text-2xl font-semibold">💳 Información de Pago</h2>
        <div className="space-y-4">
          <div className="bg-gray-100 p-3 rounded-md">
            {loading ? (
              <p className="text-center p-8">Cargando perfil...</p>
            ) : (
              <>
                <p>
                  <strong>Correo electrónico:</strong> {user?.email}
                </p>
                <p>
                  <strong>Dirección de envío:</strong> {user?.address}
                </p>
              </>
            )}
          </div>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Número de tarjeta
              </label>
              <input
                type="text"
                placeholder="Número de tarjeta"
                className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Fecha de vencimiento
                </label>
                <input
                  type="text"
                  placeholder="MM / AA"
                  className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Código de seguridad
                </label>
                <input
                  type="text"
                  placeholder="CVC"
                  className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre del titular
              </label>
              <input
                type="text"
                placeholder="Nombre del titular"
                className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked />
              <span>
                Usar la dirección de envío como dirección de facturación
              </span>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}
            {errorGetUser && <p className="text-red-600 text-sm">{errorGetUser}</p>}

            <Button
              onClick={handleConfirmPurchase}
              disabled={submitting}
              className="w-full bg-green-600 text-white hover:bg-green-700 py-3 text-lg"
            >
              {submitting ? "Procesando..." : "Confirmar compra"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
