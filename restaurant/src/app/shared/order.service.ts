import { Injectable } from '@angular/core';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OrderAndDetails } from './orderAndDetails.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  formaData: Order;
  orderItems: OrderItem[];
  constructor(private http: HttpClient) { }
  saveOrUpdateOrder() {
    const body = {
      ...this.formaData,
      OrderItems: this.orderItems
    };
    return  this.http.post(environment.apiURL + '/Order', body);
  }
  getOrderList() {
    return this.http.get(environment.apiURL + '/Order').toPromise();
  }
  getOrderByID(id: number) {
    return this.http.get(environment.apiURL + '/Order/' + id).toPromise();
  }
  deleteOrderByID(id: number) {
    return this.http.delete(environment.apiURL + '/Order/' + id).toPromise();
  }
}
