import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { User } from '../../models/user.model';

@Injectable()
export class AuthenticationService {
    user: User = {
        id:1,
        username:"",
        userRole: "",
        password: "",
        firstName: "",
        lastName: ""
    };
    constructor(private http: HttpClient) { }
    
    login(username: string, password: string) {  
        console.log(username);      
        if (username.toLocaleLowerCase() === 'admin') {
            this.user.username = username;
            this.user.userRole = "Admin";
        } else if (username.toLocaleLowerCase() === 'user') {
            this.user.username = username;
            this.user.userRole = "User";
        }
        else {
            this.user.username = username;
        }
        return this.user;
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');        
    }
}