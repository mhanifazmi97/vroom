import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TopUpPageRoutingModule } from './top-up-routing.module';

import { TopUpPage } from './top-up.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TopUpPageRoutingModule
  ],
  declarations: [TopUpPage]
})
export class TopUpPageModule {}
