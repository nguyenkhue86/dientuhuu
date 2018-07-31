import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  login: boolean;

  constructor(
    private cookieService: CookieService
  ) { }

  ngOnInit() {
    this.login = this.cookieService.check('user');
  }
}
