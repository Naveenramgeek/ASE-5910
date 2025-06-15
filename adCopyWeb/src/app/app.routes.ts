import { Routes } from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {SigninComponent} from "./components/signin/signin.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {HistoryComponent} from "./components/history/history.component";

export const routes: Routes = [
  { path: '', component: SigninComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'history', component: HistoryComponent}
];
