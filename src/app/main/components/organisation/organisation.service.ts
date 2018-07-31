import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Organisation } from '../../models/organisation.model';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { API_URL } from '../../components/content';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const apiURLForOrganization = API_URL + '/organization';

@Injectable()
export class OrganisationService {
  organisations: any[];
  constructor(
    private http: HttpClient
  ) {

  }

  getOrganizations(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(apiURLForOrganization)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  getSearchOrganisations(shortName, location): Observable<any[]> {
    let url = apiURLForOrganization;
    var params = [];
    if (shortName != "") {
      params.push("shortName="+shortName);
    }

    if (location != "") {
      params.push("location="+location);
    }

    if (status != "") {
      params.push("status="+status);
    }

    var joinQuery = params.join("&");
    url = url + "?" + joinQuery;
    return this.http.get<any[]>(url);
  }

  getOrganization(obj): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any>(apiURLForOrganization + '?' + obj.field + '=' + obj.value).subscribe(org => {
        resolve(org);
      }, reject);
    });
  }

  getOrganisationsPromise(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(apiURLForOrganization).subscribe(organizations => {
        resolve(organizations);
      });
    });
  }

  getOrganisationList(): Observable<any[]> {
    return this.http.get<any[]>(apiURLForOrganization);
  }

  getOrganisation(field, value): Observable<any[]> {
    return this.http.get<any[]>(apiURLForOrganization + '?' + field + '=' + value);
  }

  getOrganisationPromise(field, value): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>(apiURLForOrganization + '?' + field + '=' + value).subscribe(data => {
        resolve(data[0]);
      }, reject);
    });
  }

  // Create Organization
  postOrganization(organisation) {
    // tslint:disable-next-line:prefer-const
    let body = {
      'data': {
        'attributes': organisation,
        'type': 'organization'
      }
    };
    return this.http.post(apiURLForOrganization, body, httpOptions);
  }
}
