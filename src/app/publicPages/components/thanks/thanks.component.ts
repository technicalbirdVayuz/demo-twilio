import { Component, OnInit } from '@angular/core';
import { BaCustomPreLoader } from '../../services/baCustomPreloader.service';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-thanks',
  templateUrl: './thanks.component.html',
  styleUrls: ['./thanks.component.scss']
})
export class ThanksComponent implements OnInit {

  public globalConfig = {
    logo: ''
  };
  constructor(
    private http: HttpClient,
    private baCustomPreLoader: BaCustomPreLoader,
    private _location: Location,
    public configService: ConfigService) {
    this.configService.getJSON().subscribe(data => {
      this.globalConfig = data;
    });
  }

  ngOnInit() {
    this.baCustomPreLoader.hide();
  }
  rejoin() {
    this._location.back();
  }
}
