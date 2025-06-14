import { Component } from '@angular/core';
import {HeaderComponent} from "../../shared/header/header.component";
import {FooterComponent} from "../../shared/footer/footer.component";
import {RouterOutlet} from "@angular/router";
import {NgForOf, NgOptimizedImage} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
    NgForOf,
    FormsModule,
    NgOptimizedImage
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
      imageUrl: 'img.png',
      description: 'Introducing Nike’s Summer Collection – bold, breathable, and built for champions. Get 30% off select styles. Just Do It.'
    }
  ];


  history = [
    { text: "Boost office productivity with DeskPro!", time: "2h ago" },
    { text: "Discover budget travel tips you'll love.", time: "1d ago" }
  ];

  generateAd() {
    // TODO: Call your backend API to generate ad
    console.log('Generating ad:', this.adData);
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  }
}
