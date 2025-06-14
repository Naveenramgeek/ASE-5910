import {inject, Injectable} from '@angular/core';
// import firebase from "firebase/compat";

import {BehaviorSubject} from "rxjs";
import { Auth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  private auth: Auth = inject(Auth);
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor() {
    // Listen for user changes
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  signOutUser() {
    return signOut(this.auth);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  getIdToken(): Promise<string | null> {
    return this.auth.currentUser?.getIdToken() || Promise.resolve(null);
  }
}
