import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { GlobalVars } from './../providers/globalVars';
import { environment, SERVER_URL } from '../../environments/environment';
import { Router } from '@angular/router';

import { IonInput } from '@ionic/angular';

@Component({
  selector: 'app-valet-summary',
  templateUrl: './valet-summary.page.html',
  styleUrls: ['./valet-summary.page.scss'],
})
export class ValetSummaryPage {
    selectedView = 'cash';
	remarks = '';
    
	@ViewChild('car_plate', {  static: false })  car_plate: IonInput;
	@ViewChild('sender_name', {  static: false })  sender_name: IonInput;
	@ViewChild('sender_contact', {  static: false })  sender_contact: IonInput;
    constructor(private router: Router, public globalVars: GlobalVars) {
    }

    submitOrder(){
		if(this.globalVars.payment_method == 'paypal'){
			this.router.navigate(['/paypal-payment/valet']);
		}else{
			this.globalVars.submitValetOrder();
		}
    }
	
	isInteger(val){
		var x;
		return !(isNaN(val) ? !1 : (x = parseFloat(val), (0 | x) === x));
	}
	
}
