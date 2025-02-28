import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";

export default function ProfilePage() {

    const { user, orders, loading, errorGetUser } = useUserProfile(true);

    const navigate = useNavigate();

    {/* logout */}
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    if (loading) return <p className="text-center p-8">Cargando perfil...</p>;
    if (errorGetUser) return <p className="text-center text-red-600 p-8">{errorGetUser}</p>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">👤 Mi Perfil</h1>
                <Button onClick={handleLogout} className="bg-red-600 text-white hover:bg-red-700">
                    Cerrar sesión
                </Button>
            </div>
            {user && (
                <div className="bg-white shadow-md rounded-lg p-6 mb-8">
                    <p><strong>Nombre:</strong> {user.firstName} {user.lastName}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Dirección:</strong> {user.address}</p>
                </div>
            )}

            {/* order history */}
            <h2 className="text-2xl font-semibold mb-4">🛍 Historial de Pedidos</h2>
            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="border rounded-lg p-4 shadow-sm bg-white"
                        >
                            <h3 className="font-semibold text-lg mb-2">
                                Pedido #{order.id}
                            </h3>
                            <p><strong>Total:</strong> Q{order.totalAmount.toFixed(2)}</p>
                            <p><strong>Estado:</strong> {order.status}</p>
                            <p><strong>Fecha de creación:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            <div className="mt-4">
                                <h4 className="font-medium">📝 Productos:</h4>
                                <ul className="list-disc ml-5 mt-2 space-y-1">
                                    {order.items.map((item) => (
                                        <li key={item.id}>
                                            Producto ID: {item.productId} - Cantidad: {item.quantity} - Precio: Q{item.price.toFixed(2)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">❌ No tienes órdenes registradas.</p>
            )}
        </div>
    );
}
