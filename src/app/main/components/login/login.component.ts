import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from './authentication.service';
import { AlertService } from './alert.service';
import { User } from '../../models/user.model';
import { CookieService } from 'ngx-cookie-service';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import * as UserActions from '../../actions/user.action';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    user: User = {
        id:1,
        username:"",
        userRole: "",
        password: "",
        firstName: "",
        lastName: ""
    };

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<AppState>,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private cookieService: CookieService) { }

    ngOnInit() {
        // reset login status
        this.authenticationService.logout();        
        this.cookieService.delete('user');
        this.router.navigate(['home']);
    }

    login() {
        this.loading = true;
        this.user = this.authenticationService.login(this.model.username, this.model.password);
        if (this.user != null) {
            this.cookieService.set( 'user', this.user.username );
            this.store.dispatch(new UserActions.ChangeUser(this.user) );
            window.location.reload();
        } else {
            this.alertService.error("This user/password doesn't exist on the system. Please enter other user.");
            this.loading = false;
        }
    }
}
