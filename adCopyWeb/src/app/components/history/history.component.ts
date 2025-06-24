import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {FooterComponent} from "../../shared/footer/footer.component";
import {HeaderComponent} from "../../shared/header/header.component";
import {ActivatedRoute} from "@angular/router";
import {AdHistoryResponse} from "../../model/ad-history-response.model";

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
export class HistoryComponent implements OnInit {

  adsHistory: AdHistoryResponse[] = [];
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.adsHistory = this.route.snapshot.data['adsHistory'];
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
