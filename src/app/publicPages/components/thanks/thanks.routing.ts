import { Routes, RouterModule } from '@angular/router';
import { ThanksComponent } from './thanks.component';

export const routes: Routes = [
    {
        path: '',
        component: ThanksComponent,
        children: [
            { path: '', redirectTo: '', pathMatch: 'full' },
            { path: '', component: ThanksComponent }
        ]
    }
];

export const routing = RouterModule.forChild(routes);
