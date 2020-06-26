import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';


export const routes: Routes = [
  { path: '', redirectTo: 'thanks', pathMatch: 'full' },
  { path: '**', redirectTo: 'thanks' }
];
export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
