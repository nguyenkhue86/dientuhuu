import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TradingAccount } from './trading-account';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { API_URL } from '../content';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
const apiURLForTradingAccount = API_URL + '/trading-account';

@Injectable()
export class TradingAccountService {
  tradingAccounts: any[];
  constructor(
    private http: HttpClient
  ) {

  }

  /**
   * get by any fields
   * @return Promise
   */
  getBy = (objectArray: any[]): Promise<any> => {
    // tslint:disable-next-line:no-shadowed-variable
    let query: String = '';
    // tslint:disable-next-line:prefer-const
    for (let i = 0; i < objectArray.length; i++) {
      if (i !== objectArray.length - 1){
        query += objectArray[i].field + '=' + objectArray[i].value + '&';
      } else {
        query += objectArray[i].field + '=' + objectArray[i].value;
      }
    }
    return new Promise((resolve, reject) => {
      this.http.get<any>(apiURLForTradingAccount + '?' + query).subscribe(acc => {
        resolve(acc);
      }, reject);
    });
  }

  // get Branch list
  getBranch(): Observable<any> {
    return this.http.get('./assets/branch.json');
  }

  getLocation(): Observable<any> {
    return this.http.get('./assets/location.json');
  }

  getCountry(): Observable<any> {
    return this.http.get('./assets/country.json');
  }
  searchTradingAccounts(accountCode: string, accountName: string, accountType: string, owner: string, status: string): Observable<any> {
    let url = apiURLForTradingAccount;
    // tslint:disable-next-line:no-var-keyword
    // tslint:disable-next-line:prefer-const
    let params = [];
    // tslint:disable-next-line:triple-equals
    if (accountCode != '') {
      params.push('accountCode=' + accountCode);
    }
    // tslint:disable-next-line:triple-equals
    if (accountName != '') {
      params.push('accountName=' + accountName);
    }

    // tslint:disable-next-line:triple-equals
    if (accountType != '') {
      params.push('accountType=' + accountType);
    }

    // tslint:disable-next-line:triple-equals
    if (owner != '') {
      params.push('owner=' + owner);
    }

    // tslint:disable-next-line:triple-equals
    if (status != '') {
      params.push('status=' + status);
    }

    // tslint:disable-next-line:prefer-const
    let joinQuery = params.join('&');
    url = url + '?' + joinQuery;
    return this.http.get(url);
  }

  getTradingAccount(field, value): Observable<any[]> {
    return this.http.get<any[]>(apiURLForTradingAccount + '?' + field + '=' + value);
  }

  /**
   * Get all trading account using promise
   * @returns Promise
   */
  getTradingAccountsPromise (): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(apiURLForTradingAccount).subscribe(acc => {
        resolve(acc);
      }, reject);
    });
  }
  

  postTradingAccount(tradingAccount,userRole) {
    console.log(tradingAccount);
    const body = {
      'data': {
        'attributes': tradingAccount,
        'type': 'trading-account',
        "userRole": userRole
      }
    };
    return this.http.post(apiURLForTradingAccount, body, httpOptions).subscribe(data => 0);
  }
}
