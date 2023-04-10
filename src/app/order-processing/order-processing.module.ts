import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { IonicModule } from '@ionic/angular';

import { OrderProcessingPageRoutingModule } from './order-processing-routing.module';

import { OrderProcessingPage } from './order-processing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderProcessingPageRoutingModule
  ],
  providers: [
    Geolocation,
	InAppBrowser
    ],
  declarations: [OrderProcessingPage]
})
export class OrderProcessingPageModule {}
