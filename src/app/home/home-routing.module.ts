import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
      },
      {
        path: 'swipe',
        loadChildren: () => import('./swipe/swipe.module').then(m => m.SwipePageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('./matches/matches.module').then(m => m.MatchesPageModule)
      },
      {
        path: '',
        redirectTo: 'swipe',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'swipe',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
