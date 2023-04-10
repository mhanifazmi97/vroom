import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabOrderPage } from './tab-order.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { TabOrderPageRoutingModule } from './tab-order-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    TabOrderPageRoutingModule
  ],
  declarations: [TabOrderPage]
})
export class TabOrderPageModule {}
