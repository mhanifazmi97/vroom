import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ServiceFeedbackPageRoutingModule } from './service-feedback-routing.module';

import { ServiceFeedbackPage } from './service-feedback.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ServiceFeedbackPageRoutingModule
  ],
  declarations: [ServiceFeedbackPage]
})
export class ServiceFeedbackPageModule {}
