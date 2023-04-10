import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlashPagePageRoutingModule } from './flash-page-routing.module';

import { FlashPagePage } from './flash-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlashPagePageRoutingModule
  ],
  declarations: [FlashPagePage]
})
export class FlashPagePageModule {}
