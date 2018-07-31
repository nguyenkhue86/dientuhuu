import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { TradingAccount } from './trading-account';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { API_URL } from '../content';

import { Bond, BondUI } from '../../models/bond.model';

const httpOptions = {
  headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    })
};

@Injectable()
export class BondService {
  constructor(
    private http: HttpClient
  ) {
  }

  // addBond(Bond): void {
  // }

  // updateBond(Bond): void{
  // }

  getBondsFilter(filter): Observable<BondUI[]> {
    return this.http.get<any[]>(API_URL + '/bond-instrument' + filter);
  }

  getBonds(): Observable<BondUI[]> {
    return this.http.get<any[]>(API_URL + '/bond-instrument');
  }
  getBond(field, value): Observable<BondUI[]> {
    return this.http.get<any>(API_URL + '/bond-instrument?' + field + '=' + value);
  }

  getBondPromise (object): Promise<Array<BondUI>> {
    if (Array.isArray(object)) {
      let query = '/bond-instrument?';
      // tslint:disable-next-line:prefer-const
      for (let e of object) {
        query += (e.field + '=' + e.value + '&');
      }
      query = query.slice(0, query.length - 1);
      return new Promise((resolve, reject) => {
        this.http.get<any>(API_URL + query).subscribe(bond => {
          resolve(bond);
        }, reject);
      });
    }

    return new Promise((resolve, reject) => {
      this.http.get<any>(API_URL + '/bond-instrument?' + object.field + '=' + object.value).subscribe(bond => {
        resolve(bond);
      }, reject);
    });
  }
  
  getBondsPromise(): Promise<BondUI[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(API_URL + '/bond-instrument').subscribe(bonds => {
        resolve(bonds);
      }, reject);
    });
  }

  postBond(bond, userRole): Observable<any>{
    const data4Post = {
      data: {
        attributes: bond,
        type: 'bond-instrument',
        userRole: userRole
      }
    }
    return this.http.post(API_URL + '/bond-instrument', data4Post, httpOptions);
  }
}
