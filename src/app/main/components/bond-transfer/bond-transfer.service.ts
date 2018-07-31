import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 
      'Content-Type': 'application/json'
    })
};

@Injectable()
export class BondTransferService {
  organisations:  any[];
  constructor(
    private http: HttpClient
  ) {

  }
  
  getOrganisations(): Promise<any>
  {
    return new Promise((resolve, reject) => {
      this.http.get('http://localhost/hyper.php')
        .subscribe((response: any) => {
          this.organisations = response;
          resolve(response);
        }, reject);
    });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
  {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getOrganisations()
      ]).then(
        () => {
          resolve();
          },
          reject
      );
    });
  }
}
