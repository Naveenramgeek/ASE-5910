import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {initializeApp} from "firebase/app";
import {environment} from "./environment";
import {provideAuth} from "@angular/fire/auth";
import {provideFirebaseApp} from "@angular/fire/app";
import {getAuth} from "firebase/auth";

const firebaseProviders = [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAuth(() => getAuth()),
];

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [...(appConfig.providers || []), ...firebaseProviders]
}).catch(err => console.error(err));
