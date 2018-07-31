import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { API_URL } from '../../components/content';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const apiURLForBondTransaction = API_URL + '/bond-transaction';

@Injectable()
export class BondTransactionService {
  organisations:  any[];
  constructor(
    private http: HttpClient
  ) {

  }
  
  getBondTransaction(transactionId:string){
    return this.http.get(apiURLForBondTransaction+"?transactionId="+transactionId);
  }

  searchBondTransaction(transactionType:string,transactionStatus:string,tradingAccount:string,bondInstrument:string,tradeDateFrom:string,tradeDateTo:string,valueDateFrom:string,valueDateTo:string,quantityMinimum:string,quantityMaximun:string,market:string): Observable<any>
  {
    let url = apiURLForBondTransaction;
    // tslint:disable-next-line:prefer-const
    let params = [];
    // tslint:disable-next-line:triple-equals
    if (transactionType != '') {
      params.push('transactionType=' + transactionType);
    }

    if (transactionStatus != '') {
      params.push('transactionStatus=' + transactionStatus);
    }

    // tslint:disable-next-line:triple-equals
    if (tradingAccount != '') {
      params.push('ourAccountId=' + tradingAccount);
    }

    // tslint:disable-next-line:triple-equals
    if (bondInstrument != '') {
      params.push('ISIN=' + bondInstrument);
    }

    // tslint:disable-next-line:triple-equals
    if (tradeDateTo != '') {
      params.push('tradeDateTo=' + tradeDateTo);
    }

    if (tradeDateFrom != '') {
      params.push('tradeDateFrom=' + tradeDateFrom);
    }

    if (valueDateFrom != '') {
      params.push('valueDateFrom=' + valueDateFrom);
    }

    if (valueDateTo != '') {
      params.push('valueDateTo=' + valueDateTo);
    }

    if (quantityMinimum != '') {
      params.push('quantityMinimum=' + quantityMinimum);
    }

    if (quantityMaximun != '') {
      params.push('quantityMaximun=' + quantityMaximun);
    }

    if (market != '') {
      params.push('market=' + market);
    }

    // tslint:disable-next-line:prefer-const
    let joinQuery = params.join('&');
    url = url + '?' + joinQuery;
    console.log(url);
    return this.http.get(url);

  }

  // Create bond transaction
  postBondTransaction(bondTransaction,userRole) {
    let body = {
      'data': {
        'attributes': bondTransaction,
        'type': 'bond-transaction',
        "userRole": userRole
      }
    };
    return this.http.post(apiURLForBondTransaction, body, httpOptions);
  }

  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
  // {
  //   return new Promise((resolve, reject) => {
  //     Promise.all([
  //       this.getOrganisations()
  //     ]).then(
  //       () => {
  //         resolve();
  //         },
  //         reject
  //     );
  //   });
  // }
}
