import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { GlobalVars } from './../providers/globalVars';
import {
    environment,
    SERVER_URL,
    PAYPAL_ENVIRONMENT,
} from '../../environments/environment';
import { Router } from '@angular/router';
import { IonInput } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
    selector: 'app-parcel-summary',
    templateUrl: './parcel-summary.page.html',
    styleUrls: ['./parcel-summary.page.scss'],
})
export class ParcelSummaryPage {
    @ViewChild('sender_name', { static: false }) sender_name: IonInput;
    @ViewChild('sender_contact', { static: false }) sender_contact: IonInput;
    @ViewChildren(IonInput) receiver_names!: QueryList<IonInput>;
    @ViewChildren(IonInput) receiver_contacts!: QueryList<IonInput>;

    public processing = false;

    constructor(
        private httpClient: HttpClient,
        private router: Router,
        public globalVars: GlobalVars,
        private iab: InAppBrowser
    ) {}

    ionViewWillEnter() {}

    submitOrder() {
        this.router.navigate(['/']);
        // if (this.globalVars.payment_method == 'paypal') {
        // 	this.router.navigate(['/paypal-payment/order']);
        // }else if (this.globalVars.payment_method == 'credit') {
        // 	this.processing = true;
        // 	let is_advanced_orders = false;
        // 	let pickup_date = '';
        // 	if (this.globalVars.pickup_datetime == 'ASAP') {
        // 		pickup_date = moment().format('YYYY-MM-DD HH:mm');
        // 	} else {
        // 		is_advanced_orders = true;
        // 		pickup_date = moment(this.globalVars.pickup_datetime, 'D MMM YYYY h:mm A').format('YYYY-MM-DD HH:mm');
        // 	}
        // 	let package_type = this.globalVars.parcel_type;
        // 	if (package_type == 'Others') {
        // 		package_type = this.globalVars.parcel_type_others;
        // 	}
        // 	let recipient_list = new Array();
        // 	let drop_off = this.globalVars.dropoff_points;
        // 	for (var i = 0; i < this.globalVars.dropoff_points.length; i++) {
        // 		recipient_list.push({
        // 			recipient_name: drop_off[i].receiver_name,
        // 			recipient_phone: drop_off[i].receiver_contact,
        // 			recipient_unit_number: drop_off[i].receiver_unit,
        // 			recipient_address: drop_off[i].receiver_location,
        // 			recipient_postal_code: drop_off[i].receiver_postal_code
        // 		});
        // 	}
        // 	const url = SERVER_URL + 'api/new-order';
        // 	const params = new HttpParams()
        // 		.set('token', this.globalVars.token)
        // 		.set('username', this.globalVars.account.username)
        // 		.set('pickup_unit_number', this.globalVars.sender_unit)
        // 		.set('pickup_address', this.globalVars.sender_location)
        // 		.set('pickup_postal_code', this.globalVars.sender_postal_code)
        // 		.set('pickup_date', pickup_date)
        // 		.set('type_of_vehicle', this.globalVars.vehicle.id)
        // 		.set('sender_name', this.globalVars.sender_name)
        // 		.set('sender_contact', this.globalVars.sender_contact)
        // 		.set('package_type', package_type)
        // 		.set('remarks', this.globalVars.remarks)
        // 		.set('payment_method', this.globalVars.payment_method)
        // 		.set('is_advanced_orders', is_advanced_orders.toString())
        // 		.set('recipient_list', JSON.stringify(recipient_list));
        // 	this.httpClient.post(url, params).subscribe(
        // 		async (response) => {
        // 			let json_data = response;
        // 			if (json_data['status_code'] == 200) {
        // 				const url2 = SERVER_URL + 'api/pay/credit-card-payment';
        // 				const params2 = new HttpParams()
        // 					.set('token', this.globalVars.token)
        // 					.set('username', this.globalVars.account.username)
        // 					.set('amount', this.globalVars.vehicle.price.toString())
        // 					.set('tracking_number', json_data['tracking_number']);
        // 				this.httpClient.post(url2, params2).subscribe(
        // 					(response2) => {
        // 						let json_data2 = response2;
        // 						if (json_data2['status_code'] == 200) {
        // 							let payment_url = json_data2['payment_url'];
        // 							this.iab.create(payment_url, '_blank');
        // 							//this.router.navigate(['/flash-page/' + json_data['tracking_number']]);
        // 							this.router.navigate(['/order-processing/' + json_data['tracking_number']]);
        // 						}
        // 					},(error) => {
        // 						alert('Encounter backend error when loading payment gateway.');
        // 						this.processing = false;
        // 					}
        // 				);
        // 			} else {
        // 				alert('Backend Error: ' + json_data['description']);
        // 				this.processing = false;
        // 			}
        // 		},async (error) => {
        // 			alert('Encounter backend error creating the order.');
        // 			this.processing = false;
        // 		});
        // } else {
        // 	this.processing = true;
        // 	this.globalVars.submitParcelOrder();
        // }
    }
}
