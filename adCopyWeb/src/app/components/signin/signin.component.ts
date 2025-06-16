import {Component, inject} from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { Router } from '@angular/router';
import {environment} from "../../../environment";
import {AuthServiceService} from "../../shared/service/auth-service.service";

const firebaseApp = initializeApp(environment.firebase);
const auth = getAuth(firebaseApp);

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

  authService = inject(AuthServiceService);
  constructor(private router: Router) {}

  login() {
    this.authService.signInWithGoogle().then((result) => {
      result.user.getIdToken().then((idToken) => {
        console.log(idToken);
      })
      console.log('Logged in');
      console.log(this.authService.getCurrentUser())
      this.router.navigate(['/dashboard']);
    });
  }
}
