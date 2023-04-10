import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehiclePageRoutingModule } from './vehicle-routing.module';

import { VehiclePage } from './vehicle.page';

@NgModule({
  imports: [
    CommonModule,
	ReactiveFormsModule,
    FormsModule,
    IonicModule,
    VehiclePageRoutingModule
  ],
  declarations: [VehiclePage],
	providers: [
		FormBuilder
	]
})
export class VehiclePageModule {}
