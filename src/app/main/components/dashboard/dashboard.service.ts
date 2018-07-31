import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 
      'Content-Type': 'application/json'
    })
};

@Injectable()
export class DashboardService implements Resolve<any>
{
    projects: any[];
    // coins: any[];
    widgets: any[];
    // users: any[];

    constructor(
        private http: HttpClient
    ) {
        
    }

    /**
     * Resolve
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getProjects(),
                // this.getCoins(),
                this.getWidgets()
                // ,
                // this.getUsers()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    getProjects(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.http.get('api/dashboard-projects')
                .subscribe((response: any) => {
                    this.projects = response;
                    resolve(response);
                }, reject);
        });
    }

    getWidgets(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.http.get('api/dashboard-widgets')
                .subscribe((response: any) => {
                    this.widgets = response;
                    resolve(response);
                }, reject);
        });
    }

    // getUsers(): Promise<any>
    // {
    //     return new Promise((resolve, reject) => {
    //         this.http.get('http://localhost/tkc/db-u.php')
    //             .subscribe((response: any) => {
    //                 this.users = response;
    //                 resolve(response);
    //             }, reject);
    //     });
    // }
    // getCoins(): Promise<any>
    // {
    //     return new Promise((resolve, reject) => {
    //         this.http.get('https://api.coinmarketcap.com/v2/ticker/?limit=10')
    //             .subscribe((response: any) => {
    //                 this.coins = response.json;
    //                 resolve(response);
    //             }, reject);
    //     });
    // }
}
