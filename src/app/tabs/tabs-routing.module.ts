import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AuthGuard } from '../services/auth-guard.service';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab-home',
        loadChildren: () => import('../tab-home/tab-home.module').then(m => m.TabHomePageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'tab-order',
        loadChildren: () => import('../tab-order/tab-order.module').then(m => m.TabOrderPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'tab-menu',
        loadChildren: () => import('../tab-menu/tab-menu.module').then(m => m.TabMenuPageModule),
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/tabs/tab-home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/tab-home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
