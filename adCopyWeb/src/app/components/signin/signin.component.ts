import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { Router } from '@angular/router';
import {environment} from "../../../environment";

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

  constructor(private router: Router) {}

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      await this.router.navigate(['/dashboard']);
    } catch (err) {
      console.error('Google login error:', err);
    }
  }

}
