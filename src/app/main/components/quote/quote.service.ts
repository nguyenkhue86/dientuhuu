import { query } from '@angular/animations';
import { Quote } from './../../models/quote.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot,  RouterStateSnapshot } from '@angular/router';

import { API_URL } from '../content';
import { ConstantPool } from '@angular/compiler/src/constant_pool';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const apiURLForQuotes = API_URL + '/quotes';

@Injectable()
export class QuoteService {
  organisations:  any[];
  constructor(
    private http: HttpClient
  ) {

  }

  getSearchQuotes(isin,issuer,transactionType,accountId,market,status): Observable<any[]>{
    let url = apiURLForQuotes;
    var params = [];
    if (isin != "") {
      params.push("ISIN="+isin);
    }

    if (issuer != "") {
      params.push("issuer="+issuer);
    }

    if (transactionType != "") {
      params.push("transactionType="+transactionType);
    }

    if (accountId != "") {
      params.push("accountId="+accountId);
    }

    if (market != "") {
      params.push("market="+market);
    }

    if (status != "") {
      params.push("status="+status);
    }

    // tslint:disable-next-line:prefer-const
    let joinQuery = params.join('&');
    url = url + '?' + joinQuery;
    console.log(url);
    return this.http.get<any[]>(url);
  }

  /**
   * Get all quotes promise
   * @returns Promise
   */
  getQuotes = (): Promise<Quote[]> => {
    return new Promise((resolve, reject) => {
      this.http.get<Quote[]>(apiURLForQuotes).subscribe(_quotes => {
        resolve(_quotes);
      }, reject);
    });
  }

  /**
   * Get quote by Id
   * @returns Promise
   */
  getBy = (objectArray: any[]): Promise<Quote> => {
    // tslint:disable-next-line:no-shadowed-variable
    let query: String = '';
    // tslint:disable-next-line:prefer-const
    for (let i = 0; i < objectArray.length; i++) {
      if (i !== objectArray.length - 1 && objectArray[i].value !== null && objectArray[i].value !== '') {
        query += objectArray[i].field + '=' + objectArray[i].value + '&';
      }
      if (i == objectArray.length - 1 && objectArray[i].value !== null && objectArray[i].value !== '') {
        query += objectArray[i].field + '=' + objectArray[i].value;
      }
    }
    return new Promise((resolve, reject) => {
      this.http.get<Quote>(apiURLForQuotes + '?' + query).subscribe(_quote => {
        resolve(_quote);
      }, reject);
    });
  }

  postQuote(quote, userRole) {
    // tslint:disable-next-line:prefer-const
    let body = {
      data: {
        attributes: quote,
        type: 'quotes',
        userRole: userRole 
      }
    };
    return this.http.post<any>(apiURLForQuotes, body, httpOptions);
  }
}
