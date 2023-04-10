import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';

import { IonicModule } from '@ionic/angular';

import { ValetPageRoutingModule } from './valet-routing.module';

import { ValetPage } from './valet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValetPageRoutingModule
  ],
  providers: [
    Geolocation
  ],
  declarations: [ValetPage]
})
export class ValetPageModule {}
