import { OrderItem } from "./OrderItem";

export interface Order {
    id: string;
    userId: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}