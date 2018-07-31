import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { API_URL } from '../../components/content';

import { Order } from '../../models/order.model';

const httpOptions = {
  headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
};

const apiURLForOrder = API_URL + '/order';

@Injectable()
export class OrderService {
  orders:  any[];
  constructor(
    private http: HttpClient
  ) {

  }

  getOrders(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(apiURLForOrder)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  searchOrders(transactionType: string, isin: string, accountId: string, status: string,market:string): Observable<any[]> {
    let url = apiURLForOrder;
    var params = [];
    if (transactionType != "") {
      params.push("transactionType="+transactionType);
    }
    if (isin != "") {
      params.push("ISIN="+isin);
    }
    if (accountId != "") {
      params.push("accountId="+accountId);
    }
    if (status != "") {
      params.push("status="+status);
    }
    if (market != "") {
      params.push("market="+market);
    }
    var joinQuery = params.join("&");
    url = url + "?" + joinQuery;
    console.log(url);
    return this.http.get<any[]>(url);
  }
  getOrder(obj): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(apiURLForOrder + '?' + obj.field + '=' + obj.value).subscribe(order => {
        resolve(order);
      }, reject);
    });
  }

  getOrderById(orderId): Observable<any> {
    if (orderId != null) {
      return this.http.get<any[]>(apiURLForOrder + '?orderId=' +orderId);
    }
    return null;    
  }

  getOrdersPromise(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(apiURLForOrder).subscribe(orders => {
        resolve(orders);
      });
    });
  }

  getOrderList(): Observable<any[]> {
    return this.http.get<any[]>(apiURLForOrder);
  }

  postOrder(order, userRole) :any{
    let body = {
      "data": {
        "attributes": order,
        "type": "order",
        "userRole": userRole
      }
    };
    return this.http.post(apiURLForOrder, body, httpOptions).subscribe(data =>data);
  }
}
