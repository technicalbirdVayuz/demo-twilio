import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-public-pages',
  template: `
      <div style="background-color: #fbfbfb;">
      <div class='preLoader' id='preLoader' [innerHTML]="globalConfig.loader"></div>
        <router-outlet></router-outlet>
      </div>
    `,
  styles: [`
    div {
        width: 100%;
        min-height: 90vh;
    }
    #preloader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1003;
        background: #000000;
        & > div {
          display: block;
          position: relative;
          left: 50%;
          top: 50%;
          width: 150px;
          height: 150px;
          margin: -75px 0 0 -75px;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top-color: $danger;
          transform: translate3d(0, 0, 0);
          animation: spin 2s linear infinite; /* Chrome, Firefox 16+, IE 10+, Opera */
          &:before {
            content: "";
            position: absolute;
            top: 5px;
            left: 5px;
            right: 5px;
            bottom: 5px;
            border-radius: 50%;
            border: 3px solid transparent;
            border-top-color: $primary;
            -webkit-animation: spin 3s linear infinite; /* Chrome, Opera 15+, Safari 5+ */
            animation: spin 3s linear infinite; /* Chrome, Firefox 16+, IE 10+, Opera */
          }
          &:after {
            content: "";
            position: absolute;
            top: 15px;
            left: 15px;
            right: 15px;
            bottom: 15px;
            border-radius: 50%;
            border: 3px solid transparent;
            border-top-color: $warning;
            animation: spin 1.5s linear infinite; /* Chrome, Firefox 16+, IE 10+, Opera */
          }
        }
      }
      .preLoader{
        position: absolute;
        z-index: 1090;
        height: 90vh;
        width: 100%;
        top: 0;
        left: 0;
        background-color: #e5e5e529;
      }
    `]
})
export class PublicPagesComponent {

  public globalConfig = {
    loader: ''
  };
  constructor(
    public configService: ConfigService
  ) {
    this.configService.getJSON().subscribe(data => {
      this.globalConfig = data;
    },
      (error) => { });
  }
}
