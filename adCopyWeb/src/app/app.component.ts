import { Component } from '@angular/core';
import {RouterModule, RouterOutlet} from '@angular/router';
import {SigninComponent} from "./components/signin/signin.component";
import {HeaderComponent} from "./shared/header/header.component";
import {FooterComponent} from "./shared/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'adCopyWeb';
}
