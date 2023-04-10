import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { environment, SERVER_URL } from '../../environments/environment';
import { Router } from '@angular/router';

import { GlobalVars } from './../providers/globalVars';

@Component({
  selector: 'app-top-up',
  templateUrl: './top-up.page.html',
  styleUrls: ['./top-up.page.scss'],
})
export class TopUpPage {
	constructor(private storage: Storage, private router: Router, public globalVars: GlobalVars) {
		
	}
	
	topup(){
		this.router.navigate(['/paypal-payment/top-up']);
	}
}
