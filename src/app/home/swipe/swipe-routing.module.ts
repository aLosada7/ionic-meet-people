import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwipePage } from './swipe.page';

const routes: Routes = [
  {
    path: '',
    component: SwipePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SwipePageRoutingModule {}
