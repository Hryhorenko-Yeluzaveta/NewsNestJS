import { Component } from '@angular/core';
import {AuthService} from "../../app/services/auth.service";
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-site-layout',
  standalone: true,
  imports: [
    MatButton,
    RouterLink,
    RouterOutlet,
    MatIconModule,
    MatMiniFabButton
  ],
  templateUrl: './site-layout.component.html',
  styleUrl: './site-layout.component.css'
})
export class SiteLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {
  }
  logout(event: MouseEvent) {
    event.preventDefault()
    this.router.navigate(['/login'])
    this.authService.logOut()
  }
}
