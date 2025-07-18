import {Component, inject} from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { Router } from '@angular/router';
import {environment} from "../../../environment";
import {AuthServiceService} from "../../shared/service/auth-service.service";
import {AsyncPipe} from "@angular/common";
import {FooterComponent} from "../../shared/footer/footer.component";
import {HeaderComponent} from "../../shared/header/header.component";

const firebaseApp = initializeApp(environment.firebase);
const auth = getAuth(firebaseApp);

@Component({
  selector: 'app-signin',
  standalone: true,
    imports: [
        AsyncPipe,
        FooterComponent,
        HeaderComponent
    ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

  authService = inject(AuthServiceService);
  constructor(private router: Router) {}

  login() {
    this.authService.signInWithGoogle().then(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}
