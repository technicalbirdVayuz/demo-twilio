import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { PublicPagesModule } from './publicPages/publicPages.module';

import { AppComponent } from './app.component';

import { HttpService } from './publicPages/services/http.service';
import { TwilioService } from './publicPages/services/twilio.service';
import { BaCustomPreLoader } from './publicPages/services/baCustomPreloader.service';
import { ConfigService } from './publicPages/services/config.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    routing,
    PublicPagesModule,
    HttpClientModule,
    HttpModule
  ],
  providers: [
    HttpService,
    TwilioService,
    BaCustomPreLoader,
    ConfigService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
