import { NgModule } from '@angular/core';
import { routing } from './thanks.routing';
import { ThanksComponent } from './thanks.component';

@NgModule({
    declarations: [
        ThanksComponent
    ],
    imports: [
        routing
    ]
})
export class ThanksModule { }
