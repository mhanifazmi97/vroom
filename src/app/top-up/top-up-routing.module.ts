import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopUpPage } from './top-up.page';

const routes: Routes = [
  {
    path: '',
    component: TopUpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TopUpPageRoutingModule {}
