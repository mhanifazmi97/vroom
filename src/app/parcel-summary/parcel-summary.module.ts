import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { IonicModule } from '@ionic/angular';

import { ParcelSummaryPageRoutingModule } from './parcel-summary-routing.module';

import { ParcelSummaryPage } from './parcel-summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ParcelSummaryPageRoutingModule
  ],
  declarations: [ParcelSummaryPage],
  providers: [
      InAppBrowser
  ]
})
export class ParcelSummaryPageModule {}
