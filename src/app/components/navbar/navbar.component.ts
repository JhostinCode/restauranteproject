import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  loggedIn:boolean;
  brandName = 'Mr Gloton';

  constructor(private router: Router){
    this.loggedIn = false;
  }
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd){
        this.loggedIn = !event.url.includes("dashboard")
      }
    });
  }

  goToLogin() {
    this.router.navigateByUrl("/auth/login")
  }
}
