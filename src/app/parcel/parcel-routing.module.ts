import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParcelPage } from './parcel.page';

const routes: Routes = [
  {
    path: '',
    component: ParcelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParcelPageRoutingModule {}
