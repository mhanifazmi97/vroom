import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabMenuPage } from './tab-menu.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';

import { TabMenuPageRoutingModule } from './tab-menu-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: TabMenuPage }]),
    TabMenuPageRoutingModule,
  ],
  declarations: [TabMenuPage],
	providers: [
		AppVersion,
		FingerprintAIO
	],
})
export class TabMenuPageModule {}
