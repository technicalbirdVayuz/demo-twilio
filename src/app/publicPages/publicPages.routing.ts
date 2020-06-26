import { Routes, RouterModule } from '@angular/router';
import { PublicPagesComponent } from './publicPages.component';
import { LiveChatComponent } from './components/live-chat/live-chat.component';

export const routes: Routes = [
    {
        path: '',
        component: PublicPagesComponent,
        children: [
            { path: '', redirectTo: 'thanks', pathMatch: 'full' },
            { path: 'live-chat/:id', component: LiveChatComponent },
            { path: 'thanks', loadChildren: './components/thanks/thanks.module#ThanksModule' }
        ]
    }
];

export const routing = RouterModule.forChild(routes);
