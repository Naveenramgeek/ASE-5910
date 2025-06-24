import {Component, inject, OnInit} from '@angular/core';
import {AuthServiceService} from "../service/auth-service.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    RouterLinkActive,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  authService = inject(AuthServiceService);

  user$ = this.authService.user$;

  constructor(private router: Router) {
  }
  ngOnInit(): void {
  }
  logout() {
    this.authService.signOutUser().then(() => {
      this.router.navigate(['/signin']);
    }).catch(error => {
      console.error('Logout error:', error);
    });}


}
