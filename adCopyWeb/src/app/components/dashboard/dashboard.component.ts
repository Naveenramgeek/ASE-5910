import { Component } from '@angular/core';
import {HeaderComponent} from "../../shared/header/header.component";
import {FooterComponent} from "../../shared/footer/footer.component";
import {NgForOf,} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    NgForOf,
    FormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  adData = {
    title: '',
    description: '',
    platform: 'Instagram',
    tone: 'Friendly'
  };

  generatedAds = [
    {
      imageUrl: 'nike.png',
      description: 'Unleash your power this summer with Nike’s bold new collection.\n' +
        'Get 30% off select styles – made for champions like you.'
    }
  ];


  history = [
    { text: "Boost office productivity with DeskPro!", time: "2h ago" },
    { text: "Discover budget travel tips you'll love.", time: "1d ago" }
  ];

  generateAd() {
    console.log('Generating ad:', this.adData);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  }
}
