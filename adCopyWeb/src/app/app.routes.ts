import { Routes } from '@angular/router';
import {DashboardComponent} from "./components/dashboard/dashboard.component";
import {SigninComponent} from "./components/signin/signin.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {HistoryComponent} from "./components/history/history.component";
import {AuthGuard} from "./guard/auth.guard";
import {AdHistoryResolver} from "./shared/resolver/ad-history.resolver";

export const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: '', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'history', component: HistoryComponent,resolve: { adsHistory: AdHistoryResolver }, canActivate: [AuthGuard]}
];
