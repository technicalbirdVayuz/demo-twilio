import { Component, ElementRef, Inject } from '@angular/core';
import { ConfigService } from './publicPages/services/config.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public configService: ConfigService,
    private elementRef: ElementRef,
    @Inject(DOCUMENT) private document: any
  ) {
    this.configService.getJSON().subscribe(data => {
      const element = this.elementRef.nativeElement;

      for (const key in data) {
        element.style.setProperty(key, data[key]);
        this.document.body.style.setProperty(key, data[key]);
      }

    });
  }
}
