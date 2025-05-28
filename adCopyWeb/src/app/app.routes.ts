import { Routes } from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {SigninComponent} from "./components/signin/signin.component";

export const routes: Routes = [
  { path: '', component: SigninComponent },
  { path: 'dashboard', component: DashboardComponent }
];
