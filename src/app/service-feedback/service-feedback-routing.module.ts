import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceFeedbackPage } from './service-feedback.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceFeedbackPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceFeedbackPageRoutingModule {}
