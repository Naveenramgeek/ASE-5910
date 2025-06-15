import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {User} from "@angular/fire/auth";
import {AuthServiceService} from "../../shared/service/auth-service.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {HeaderComponent} from "../../shared/header/header.component";
import {FooterComponent} from "../../shared/footer/footer.component";

@Component({
  selector: 'app-profile',
  imports: [
    AsyncPipe,
    NgIf,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user$: Observable<User | null>;

  constructor(private authService: AuthServiceService) {
    this.user$ = this.authService.user$;
  }
}
