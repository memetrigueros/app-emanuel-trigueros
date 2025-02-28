import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { UserProfile } from "@/types/UserProfile";
import { Order } from "@/types/Order";

export const useUserProfile = (fetchOrders: boolean = false) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorGetUser, seteErrorGetUser] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await api.get("/users/me");
        setUser(userResponse.data);

        if (fetchOrders) {
          const ordersResponse = await api.get(`/orders/user`);
          setOrders(ordersResponse.data);
        }
      } catch (err) {
        seteErrorGetUser("Error al obtener la información del perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchOrders]);

  return { user, orders, loading, errorGetUser };
};
