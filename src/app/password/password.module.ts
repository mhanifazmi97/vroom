import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasswordPageRoutingModule } from './password-routing.module';

import { PasswordPage } from './password.page';

@NgModule({
  imports: [
    CommonModule,
	ReactiveFormsModule,
    FormsModule,
    IonicModule,
    PasswordPageRoutingModule
  ],
  declarations: [PasswordPage],
	providers: [
		FormBuilder
	]
})
export class PasswordPageModule {}
