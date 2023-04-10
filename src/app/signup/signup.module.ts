import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';

@NgModule({
  imports: [
    CommonModule,
	ReactiveFormsModule,
	FormsModule,
    IonicModule,
    SignupPageRoutingModule
  ],
  declarations: [SignupPage],
	providers: [
		FormBuilder,
		InAppBrowser
	]
})
export class SignupPageModule {}
