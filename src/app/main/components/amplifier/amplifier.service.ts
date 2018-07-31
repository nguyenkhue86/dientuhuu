import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Amplifier } from '../../models/amplifier.model';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { API_URL } from '../../components/content';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const apiURLForAmplifier = API_URL + '/amplifier';

@Injectable()
export class AmplifierService {
  Amplifiers: any[];
  constructor(
    private http: HttpClient
  ) {

  }

  getAmplifiers(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(apiURLForAmplifier)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getAmplifierByParamater(paramater:string): Observable<any[]> {
    
    return this.http.get<any[]>(apiURLForAmplifier+'?'+paramater);
  }

  getAmplifier(obj): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(apiURLForAmplifier + '?' + obj.field + '=' + obj.value).subscribe(org => {
        resolve(org);
      }, reject);
    });
  }

  getAmplifiersPromise(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(apiURLForAmplifier).subscribe(Amplifiers => {
        resolve(Amplifiers);
      });
    });
  }

  getAmplifierList(): Observable<any[]> {
    return this.http.get<any[]>(apiURLForAmplifier);
  }

  getAmplifierPromise(field, value): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(apiURLForAmplifier + '?' + field + '=' + value).subscribe(data => {
        resolve(data[0]);
      }, reject);
    });
  }

  // Create Amplifier
  postAmplifier(Amplifier) {
    // tslint:disable-next-line:prefer-const
    let body = {
      'data': {
        'attributes': Amplifier,
        'type': 'Amplifier'
      }
    };
    return this.http.post(apiURLForAmplifier, body, httpOptions);
  }
}
