import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParcelSummaryPage } from './parcel-summary.page';

const routes: Routes = [
  {
    path: '',
    component: ParcelSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParcelSummaryPageRoutingModule {}
