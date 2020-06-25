import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwipePage } from './swipe.page';

import { SwipePageRoutingModule } from './swipe-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SwipePageRoutingModule
  ],
  declarations: [SwipePage]
})
export class SwipePageModule {}
