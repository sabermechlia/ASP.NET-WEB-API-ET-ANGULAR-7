import { OrderItemsComponent } from './../order-items/order-items.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/order.service';
import { NgForm } from '@angular/forms';
import { CustomerService } from 'src/app/shared/customer.service';
import { Customer } from 'src/app/shared/customer.model';
import { ToastrService } from 'ngx-toastr';
import { Console } from '@angular/core/src/console';
import { OrderAndDetails } from 'src/app/shared/orderAndDetails.model';


@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: []
})
export class OrderComponent implements OnInit {
  CustomerList: Customer[];
  isValid = true;
  constructor(public service: OrderService,
              public router: Router,
              private dialog: MatDialog,
              private customerService: CustomerService,
              private toastr: ToastrService,
              private courrantRoute: ActivatedRoute) { }

  ngOnInit() {
    const orderId = this.courrantRoute.snapshot.paramMap.get('id');
    if (orderId == null) {
      this.resetFormMe();
    } else {
      this.service.getOrderByID(parseInt(orderId)).then((res) => {
        const respence = res as OrderAndDetails;
        this.service.formaData = respence.order;
        this.service.orderItems = respence.orderDetails;
        console.log(respence.orderDetails);
        this.service.formaData.DeletedOrderItemIDs = '';
      });
    }
    this.customerService.getCustomerList().then(res => {
        this.CustomerList = res as Customer[];
      });
    }
  
    resetFormMe(form ?: NgForm) {
      if (form != null) {
        form.resetForm();

      }

      this.service.formaData = {
        OrderId: null,
        OrderNo: Math.floor(100000 + Math.random() * 900000).toString(),
        CustomerID: 0,
        PMethod: '',
        GTotal: 0,
        DeletedOrderItemIDs: ''

      };
      this.service.orderItems = [];
    }
    AddOrEditOrderItem(orderItemIndex, OrderID) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.disableClose = true;
      dialogConfig.width = '50%';
      dialogConfig.data = { orderItemIndex, OrderID };
      this.dialog.open(OrderItemsComponent, dialogConfig).afterClosed().subscribe(res => {
        this.updateGrandTotal();
      });
    }
    onDeleteOrderItem(orderItemID: string, index: number) {

      if (orderItemID !== null) {


        this.service.formaData.DeletedOrderItemIDs += orderItemID + ',';

      }
      this.service.orderItems.splice(index, 1);
      this.updateGrandTotal();
    }

    updateGrandTotal() {
      this.service.formaData.GTotal = this.service.orderItems.reduce((prev, curr) => {
        return prev + curr.Total;
      }, 0);
      this.service.formaData.GTotal = parseFloat(this.service.formaData.GTotal.toFixed(2));
    }
    validateForm() {
      this.isValid = true;
      if (this.service.formaData.CustomerID === 0) {
        this.isValid = false;
      } else if (this.service.orderItems.length === 0) {
        this.isValid = false;
      }
      return this.isValid;
    }
    onSubmit(form: NgForm) {
      if (this.validateForm()) {
        this.service.saveOrUpdateOrder().subscribe(res => {
          this.resetFormMe();
          this.toastr.success('Submitted Successfully', 'Resaurent App');
          this.router.navigate(['/orders']);
        });
      }
    }
  }
