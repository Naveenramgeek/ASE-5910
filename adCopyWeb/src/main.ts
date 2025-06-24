import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import {environment} from "./environment";
import {getAuth, provideAuth} from "@angular/fire/auth";
import {initializeApp, provideFirebaseApp} from "@angular/fire/app";
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import { authInterceptorFn} from "./app/interseptors/auth.interceptor";

const firebaseProviders = [
  provideFirebaseApp(() => initializeApp(environment.firebase)),
  provideAuth(() => getAuth()),
];

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [...(appConfig.providers || []), ...firebaseProviders, provideHttpClient(withInterceptors([authInterceptorFn]))]
}).catch(err => console.error(err));
