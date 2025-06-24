import { Component } from '@angular/core';
import {HeaderComponent} from "../../shared/header/header.component";
import {FooterComponent} from "../../shared/footer/footer.component";
import {NgForOf, NgIf,} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {AdGenerationRequest} from "../../model/ad-generation-request.model";
import {ApiService} from "../../shared/service/api.service";
import {response} from "express";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    NgForOf,
    FormsModule,
    NgIf,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  constructor(private apiService: ApiService) {
  }

  adData: AdGenerationRequest = {
    title: '',
    description: '',
    platform: 'Instagram',
    tone: 'Friendly'
  };

  loading = false;
  imageGenerated = false;

  generatedAds = [
    {
      imageUrl: '',
      description: ''
    }
  ];

  generateAd() {
    this.loading = true;
    this.imageGenerated = true;
    this.apiService.generateAdImage(this.adData).subscribe(response => {
      this.generatedAds[0].imageUrl = response.imageUrl;
      this.generatedAds[0].description = response.promptUsed;// Assuming the response contains an imageUrl
      this.loading = false;
      console.log(response)
    })
  }

  downloadImage(url: string, filename: string) {
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
      })
      .catch(err => console.error('Download error:', err));
  }

  copyToClipboard(text: string) {
    if (navigator.clipboard && window.isSecureContext) {
      // Preferred modern API
      navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
      }).catch(() => {
        this.fallbackCopy(text);
      });
    } else {
      // Fallback for mobile or insecure contexts
      this.fallbackCopy(text);
    }
  }

  private fallbackCopy(text: string) {
    const textarea = document.createElement('textarea');
    textarea.value = text;

    // Avoid scrolling to bottom
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '1px';
    textarea.style.height = '1px';
    textarea.style.opacity = '0';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert('Copied to clipboard!');
      } else {
        alert('Failed to copy text');
      }
    } catch (err) {
      alert('Unsupported browser');
    }

    document.body.removeChild(textarea);
  }

}
