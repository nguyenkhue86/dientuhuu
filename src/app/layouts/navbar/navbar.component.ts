import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  menuList = [
    {
      icon: 'home',
      name: 'HOME',
      path: 'dashboard'
    },
    {
      icon: 'info',
      name: 'INFORMATION',
      path: 'information'
    },
  ];
  constructor( private router: Router) { }
  ngOnInit() {
  }

  getComponent(path) {
    this.router.navigate([path]);
  }

}
