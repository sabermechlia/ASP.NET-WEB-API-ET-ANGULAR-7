import { Order } from './order.model';
import { OrderItem } from './order-item.model';

export class OrderAndDetails {
    order: Order;
    orderDetails: OrderItem[];
}
