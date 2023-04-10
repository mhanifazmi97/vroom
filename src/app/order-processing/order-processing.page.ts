import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { environment, SERVER_URL } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import {
    AngularFireDatabase,
    AngularFireList,
    AngularFireObject,
} from '@angular/fire/database';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AlertController } from '@ionic/angular';

import { GlobalVars } from '../../app/providers/globalVars';
import { DummyData } from '../../app/providers/dummyData';

@Component({
    selector: 'app-order-processing',
    templateUrl: './order-processing.page.html',
    styleUrls: ['./order-processing.page.scss'],
})
export class OrderProcessingPage {
    public processing = false;
    public payment_method = '';
    orderRef: AngularFireObject<any>;
    tracking_number;
    order = {
        assign_to_driver: '',
        charge_amount: 0,
        delivery_distance: 0,
        driver_commision: 0,
        driver_lat: '',
        driver_lng: '',
        driver_name: '',
        driver_phone: '',
        driver_photo: '',
        driver_plate_number: '',
        driver_assigned_time: '',
        est_delivery_time: '',
        est_pickup_time: '',
        merchant_name: '',
        order_type: '',
        package_type: '',
        payment_method: '',
        pickup_address: '',
        pickup_unit_number: '',
        pickup_contact: '',
        pickup_date: '',
        pickup_postal_code: '',
        recipient_list: [],
        remarks: '',
        state: '',
        tracking_number: '',
        type_of_vehicle_id: '',
        vehicle_plate_number: '',
        vehicle_transmission: '',
        icon: '',
        surcharge: [],
        deliveryPrice: 0,
    };
    diff = 0;

    constructor(
        private router: Router,
        private httpClient: HttpClient,
        public globalVars: GlobalVars,
        public dummyData: DummyData,
        public navCtrl: NavController,
        private activatedRoute: ActivatedRoute,
        private db: AngularFireDatabase,
        private iab: InAppBrowser,
        public alertController: AlertController
    ) {
        this.tracking_number =
            this.activatedRoute.snapshot.paramMap.get('tracking_number');
        this.orderRef = this.db.object('/trackings/' + this.tracking_number);

        for (let i in this.dummyData.items) {
            let item = this.dummyData.items[i];

            if (this.tracking_number == item.tracking_number) {
                this.order = {
                    assign_to_driver: 'David',
                    charge_amount: 10,
                    delivery_distance: 20,
                    driver_commision: 5,
                    driver_lat: '1.352083',
                    driver_lng: '103.819839',
                    driver_name: 'David',
                    driver_phone: '123872414',
                    driver_photo: '',
                    driver_plate_number: 'S8407T',
                    driver_assigned_time: '04:00PM',
                    est_delivery_time: '04:40PM',
                    est_pickup_time: '05:10PM',
                    merchant_name: 'VR',
                    order_type: 'parcel',
                    package_type: 'Document',
                    payment_method: 'Cash',
                    pickup_address: '548 Woodlands Drive 44, Singapore 730548',
                    pickup_unit_number: 'A29',
                    pickup_contact: '21415124',
                    pickup_date: '10 Apr 2023',
                    pickup_postal_code: '730548',
                    recipient_list: this.dummyData.recipient_list,
                    remarks: '',
                    state: 'Finding Driver',
                    tracking_number: item.tracking_number,
                    type_of_vehicle_id: '1',
                    vehicle_plate_number: 'S9238F',
                    vehicle_transmission: '',
                    icon: '',
                    surcharge: [],
                    deliveryPrice: 10,
                };
                let deliveryPriceCalculation = +item.charge_amount;
                for (let item in this.order.surcharge) {
                    deliveryPriceCalculation -=
                        this.order.surcharge[item].amount;
                }

                this.order.deliveryPrice = deliveryPriceCalculation;
                let time;
                if (this.order.state === 'Finding Driver') {
                    time = this.order.pickup_date;
                } else {
                    time = this.order.driver_assigned_time;
                }
                this.diff = moment().diff(
                    moment(time, 'YYYY-MM-DD HH:mm:ss'),
                    'minutes'
                );

                this.payment_method = this.order.payment_method;
            }
        }
    }

    pay() {
        this.processing = true;

        if (this.payment_method == 'credit') {
            const url = SERVER_URL + 'api/pay/credit-card-payment';
            const params = new HttpParams()
                .set('token', this.globalVars.token)
                .set('username', this.globalVars.account.username)
                .set('amount', this.order.charge_amount.toString())
                .set('tracking_number', this.order.tracking_number);

            this.httpClient.post(url, params).subscribe(
                (response) => {
                    console.log(response);
                    let json_data = response;
                    if (json_data['status_code'] == 200) {
                        let payment_url = json_data['payment_url'];
                        this.iab.create(payment_url, '_blank');
                    }

                    this.processing = false;
                },
                (error) => {
                    alert('Encounter error when loading payment gateway.');
                    this.processing = false;
                }
            );
        } else {
            const url = SERVER_URL + 'api/update-order';
            const params = new HttpParams()
                .set('token', this.globalVars.token)
                .set('username', this.globalVars.account.username)
                .set('payment_method', this.payment_method)
                .set('tracking_number', this.order.tracking_number);

            this.httpClient.post(url, params).subscribe(
                (response) => {
                    let json_data = response;
                    if (json_data['status_code'] == 200) {
                        this.router.navigate([
                            '/flash-page/' + this.order.tracking_number,
                        ]);
                    }

                    this.processing = false;
                },
                (error) => {
                    alert('Encounter error updating order.');
                    this.processing = false;
                }
            );
        }
    }

    async cancelOrder() {
        const alert = await this.alertController.create({
            header: 'Cancel Order!',
            message:
                'Please take note, there will be a cancellation charge of $10.',
            cssClass: 'my-custom-class',
            buttons: [
                {
                    text: 'Continue Booking',
                    role: 'cancel',
                },
                {
                    text: 'Cancel Booking',
                    cssClass: 'redcolor',
                    handler: (data) => {
                        this.processing = true;
                        const url = SERVER_URL + 'api/merchant-cancel-order';
                        const params = new HttpParams()
                            .set('token', this.globalVars.token)
                            .set('username', this.globalVars.account.username)
                            .set('tracking_number', this.tracking_number);

                        this.httpClient.post(url, params).subscribe(
                            (response) => {
                                let json_data = response;
                                if (json_data['status_code'] == 200) {
                                    this.globalVars.items = new Array();
                                    this.globalVars.start = 0;
                                    this.globalVars.loadOrders(null);
                                    this.router.navigate(['/tabs/tab-order']);
                                }

                                this.processing = false;
                            },
                            (error) => {
                                this.processing = false;
                            }
                        );
                    },
                },
            ],
        });

        await alert.present();
    }

    back() {
        this.navCtrl.navigateRoot('/tabs/tab-order');
    }
}
