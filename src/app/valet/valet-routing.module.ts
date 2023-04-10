import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValetPage } from './valet.page';

const routes: Routes = [
  {
    path: '',
    component: ValetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValetPageRoutingModule {}
