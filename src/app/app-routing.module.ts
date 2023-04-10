import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'signup',
    loadChildren: () =>
      import('./signup/signup.module').then((m) => m.SignupPageModule),
  },
  {
    path: 'forget-password',
    loadChildren: () =>
      import('./forget-password/forget-password.module').then(
        (m) => m.ForgetPasswordPageModule
      ),
  },
  {
    path: 'order-details',
    loadChildren: () =>
      import('./order-details/order-details.module').then(
        (m) => m.OrderDetailsPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'parcel',
    loadChildren: () =>
      import('./parcel/parcel.module').then((m) => m.ParcelPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'parcel-summary',
    loadChildren: () =>
      import('./parcel-summary/parcel-summary.module').then(
        (m) => m.ParcelSummaryPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'order-processing/:tracking_number',
    loadChildren: () =>
      import('./order-processing/order-processing.module').then(
        (m) => m.OrderProcessingPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'order-history',
    loadChildren: () =>
      import('./order-history/order-history.module').then(
        (m) => m.OrderHistoryPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'valet',
    loadChildren: () =>
      import('./valet/valet.module').then((m) => m.ValetPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'valet-summary',
    loadChildren: () =>
      import('./valet-summary/valet-summary.module').then(
        (m) => m.ValetSummaryPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'flash-page/:tracking_number',
    loadChildren: () =>
      import('./flash-page/flash-page.module').then(
        (m) => m.FlashPagePageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'paypal-payment/:type',
    loadChildren: () =>
      import('./paypal-payment/paypal-payment.module').then(
        (m) => m.PaypalPaymentPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'transactions',
    loadChildren: () =>
      import('./transactions/transactions.module').then(
        (m) => m.TransactionsPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'top-up',
    loadChildren: () =>
      import('./top-up/top-up.module').then((m) => m.TopUpPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'vehicle',
    loadChildren: () =>
      import('./vehicle/vehicle.module').then((m) => m.VehiclePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'password',
    loadChildren: () =>
      import('./password/password.module').then((m) => m.PasswordPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'landing-page',
    loadChildren: () =>
      import('./landing-page/landing-page.module').then(
        (m) => m.LandingPagePageModule
      ),
  },
  {
    path: 'service-feedback',
    loadChildren: () =>
      import('./service-feedback/service-feedback.module').then(
        (m) => m.ServiceFeedbackPageModule
      ),
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
