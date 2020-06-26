import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing } from './publicPages.routing';

import { PublicPagesComponent } from './publicPages.component';
import { LiveChatComponent } from './components/live-chat/live-chat.component';

@NgModule({
  declarations: [
    PublicPagesComponent,
    LiveChatComponent
  ],
  imports: [
    BrowserModule,
    routing
  ]
})
export class PublicPagesModule { }
