import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValetSummaryPageRoutingModule } from './valet-summary-routing.module';

import { ValetSummaryPage } from './valet-summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValetSummaryPageRoutingModule
  ],
  declarations: [ValetSummaryPage]
})
export class ValetSummaryPageModule {}
