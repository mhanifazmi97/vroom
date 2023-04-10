import { Component } from '@angular/core';
import * as moment from 'moment';
import { GlobalVars } from './../providers/globalVars';
import { environment, SERVER_URL, PAYPAL_ENVIRONMENT } from '../../environments/environment';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

declare var paypal: any;

@Component({
  selector: 'app-paypal-payment',
  templateUrl: './paypal-payment.page.html',
  styleUrls: ['./paypal-payment.page.scss'],
})
export class PaypalPaymentPage {
	payPalConfig: any;
	amount = 0;
	type = '';
	
	constructor(private router: Router, public globalVars: GlobalVars, private activatedRoute: ActivatedRoute) {
		this.type = this.activatedRoute.snapshot.paramMap.get('type');
		
		if(this.type == 'order'){
			this.amount = this.globalVars.vehicle.price;
		}else if(this.type == 'valet'){
			this.amount = this.globalVars.fee;
		}else if(this.type == 'top-up'){
			this.amount = this.globalVars.top_up_amount;
		}else{
			this.amount = 0;
		}
		
		this.payPalConfig = {
			env: PAYPAL_ENVIRONMENT,
			client: {
				sandbox: this.globalVars.payPalEnvironmentSandbox,
				production: this.globalVars.payPalEnvironmentProduction
			},
			commit: true,
			createOrder: (data, actions)=> {
				return actions.order.create({
					purchase_units: [{
						amount: {
							value: (this.amount).toFixed(2),
							currency: 'SGD' 
						}
					}]
				});
			},
			// Finalize the transaction
			onApprove: (data, actions) => {
				//console.log(data)
				//console.log(actions)
				return actions.order.capture()
				.then((details) => {
					let status = details["status"]
					let id = details["id"]
					if (status == "COMPLETED") {
						if(this.type == 'order'){
							this.globalVars.submitParcelOrder();
						}else if(this.type == 'valet'){
							this.globalVars.submitValetOrder();
						}else if(this.type == 'top-up'){
							this.globalVars.topup();
						}
					}else {
						//Status not completed...
					}
					//console.log('Transaction completed by ' + details.payer.name.given_name + '!');
				})
				.catch(err => {
					//console.log(err);
				})
			},
			onError: (err) => {
				// Show an error page here, when an error occurs
				//console.log(err)
				// deal with error
			}
        };
	}
	
	ionViewDidEnter() {
		if(this.amount > 0){
			paypal.Buttons(this.payPalConfig).render('#paypal-button');
		}
    }
}
