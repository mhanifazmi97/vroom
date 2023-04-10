import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlashPagePage } from './flash-page.page';

const routes: Routes = [
  {
    path: '',
    component: FlashPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlashPagePageRoutingModule {}
