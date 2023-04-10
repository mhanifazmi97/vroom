import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValetSummaryPage } from './valet-summary.page';

const routes: Routes = [
  {
    path: '',
    component: ValetSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValetSummaryPageRoutingModule {}
