import { Component } from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {FooterComponent} from "../../shared/footer/footer.component";
import {HeaderComponent} from "../../shared/header/header.component";

@Component({
  selector: 'app-history',
  imports: [
    AsyncPipe,
    FooterComponent,
    HeaderComponent,
    NgForOf
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent {

  adHistory = [
    {
      imageUrl: 'biryani.png',
      description: 'Savor the royal flavors of Desi Bites with exclusive biryani deals.\n' +
        'Order now and spice up your mealtime with irresistible taste!\n' +
        '\n'
    },
    {
      imageUrl: 'nyc.png',
      description: 'Explore New York this summer with 30% off on dream vacations.\n' +
        'Book your adventure today with Happy Travels and save big!'
    }

  ];

  copyText(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Description copied to clipboard!');
    });
  }
}
