import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment, SERVER_URL } from '../../environments/environment';
import { Platform } from '@ionic/angular';
// import {
//   Push,
//   PushObject,
//   PushOptions,
// } from '@awesome-cordova-plugins/push/ngx';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { DummyData } from './dummyData';
import { IonInfiniteScroll } from '@ionic/angular';

@Injectable()
export class GlobalVars {
    public token = 'Qwerty1234';
    public account: any;
    public registrationId = '';
    public credit = 0;

    public pickup_datetime = 'ASAP';
    public payment_method = 'cash';
    public remarks = '';
    public order_detail = {
        order_type: '',
        icon: '',
        tracking_number: '',
        pickup_address: '',
        pickup_postal_code: '',
        pickup_unit_number: '',
        pickup_name: '',
        pickup_contact: '',
        delivery_distance: '',
        date: '',
        status: '',
        package_type: '',
        package_weight: '',
        est_pickup_time: '',
        est_delivery_time: '',
        type_of_vehicle_id: '',
        vehicle_plate_number: '',
        vehicle_transmission: '',
        charge_amount: '',
        remarks: '',
        recipients: [],
        surcharge: [],
        deliveryPrice: 0,
        is_feedback_received: false,
    };

    public top_up_amount = 0;

    //valet
    public car_plate = '';
    public vehicle_transmission = '';
    public fee = 0;
    public distance = 0;

    //delivery
    public sender_postal_code = '';
    public sender_location = '';
    public sender_unit = '';
    public sender_name = '';
    public sender_contact = '';
    public sender_location_text = '';

    public dropoff_points = new Array();
    public vehicle: any;
    public duration: any;
    public trip: 'One Way';
    public parcel_type = '';
    public parcel_type_others = '';

    //profile
    public profile_name = '';
    public profile: any;

    //orders
    public nodata = false;
    public loading = false;
    public start = 0;
    public items = new Array();
    public ev: any;

    public token_value = 'Express-Auth-Token';
    public payPalEnvironmentProduction =
        'A-5Hr1PH09JZZZBX9zYXzJ47r1xsAqolO9TpI3vtO9rVgBoMIi5Xr45B';
    public payPalEnvironmentSandbox =
        'ASY8whn1XSkBPYN9wrncH5ueZqvek5MWlNCTS3PyaLjkjf0HcBBxMh7ovUekzYQNeXYr40_dnU1VfNNI';

    constructor(
        public platform: Platform,
        private httpClient: HttpClient,
        private storage: Storage,
        public dummyData: DummyData,
        //private push: Push,
        private router: Router
    ) {
        this.platform.ready().then(async () => {
            //this.pushSetup();
            const key: any = await this.storage.get(this.token_value);
            if (key != null && key.role) {
                this.setAccount(key);
                this.getProfile();
            }
        });
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    setAccount(account1) {
        this.account = account1;
    }

    getProfile() {
        let username = this.account.username;
        for (let i in this.dummyData.profiles) {
            let user = this.dummyData.profiles[i];

            if (username == user['name']) {
                this.profile_name = user['name'];
                this.profile = user;
                this.credit = this.profile.wallet;
            }
        }
    }

    //   pushSetup() {
    //     // to initialize push notifications
    //     const options: PushOptions = {
    //       android: {},
    //       ios: {
    //         alert: 'true',
    //         badge: 'true',
    //         sound: 'true',
    //       },
    //       browser: {
    //         pushServiceURL: 'http://push.api.phonegap.com/v1/push',
    //       },
    //     };

    //     const pushObject: PushObject = this.push.init(options);

    //     pushObject
    //       .on('notification')
    //       .subscribe((notification: any) =>
    //         console.log('Received a notification', notification)
    //       );

    //     pushObject.on('registration').subscribe((registration: any) => {
    //       this.registrationId = registration.registrationId;

    //       /**
    // 			const url = 'https://ventureitsolution.com/json_post/post.php';
    // 			const params = new HttpParams().set('registrationId', this.registrationId);
    // 			this.httpClient.post(url, params).subscribe(async (response) => {
    // 				alert(this.registrationId);
    // 			}, async (error) => {
    // 				alert('Error' + error.error);
    // 			});
    // 			**/
    //       console.log(this.registrationId);
    //     });

    //     pushObject.on('error').subscribe((error) => {
    //       this.registrationId = '';
    //     });
    //   }

    submitParcelOrder() {
        let is_advanced_orders = false;
        let pickup_date = '';
        if (this.pickup_datetime == 'ASAP') {
            pickup_date = moment().format('YYYY-MM-DD HH:mm');
        } else {
            is_advanced_orders = true;
            pickup_date = moment(
                this.pickup_datetime,
                'D MMM YYYY h:mm A'
            ).format('YYYY-MM-DD HH:mm');
        }

        let package_type = this.parcel_type;
        if (package_type == 'Others') {
            package_type = this.parcel_type_others;
        }

        let recipient_list = new Array();
        let drop_off = this.dropoff_points;
        for (var i = 0; i < this.dropoff_points.length; i++) {
            recipient_list.push({
                recipient_name: drop_off[i].receiver_name,
                recipient_phone: drop_off[i].receiver_contact,
                recipient_unit_number: drop_off[i].receiver_unit,
                recipient_address: drop_off[i].receiver_location,
                recipient_postal_code: drop_off[i].receiver_postal_code,
            });
        }

        const url = SERVER_URL + 'api/new-order';
        const params = new HttpParams()
            .set('token', this.token)
            .set('username', this.account.username)
            .set('pickup_unit_number', this.sender_unit)
            .set('pickup_address', this.sender_location)
            .set('pickup_postal_code', this.sender_postal_code)
            .set('pickup_date', pickup_date)
            .set('type_of_vehicle', this.vehicle.id)
            .set('sender_name', this.sender_name)
            .set('sender_contact', this.sender_contact)
            .set('package_type', package_type)
            .set('remarks', this.remarks)
            .set('payment_method', this.payment_method)
            .set('is_advanced_orders', is_advanced_orders.toString())
            .set('recipient_list', JSON.stringify(recipient_list));

        this.httpClient.post(url, params).subscribe(
            async (response) => {
                let json_data = response;
                if (json_data['status_code'] == 200) {
                    this.clearAll();
                    this.router.navigate([
                        '/flash-page/' + json_data['tracking_number'],
                    ]);
                } else {
                    alert(json_data['description']);
                }
            },
            async (error) => {
                alert('Error' + error.error);
            }
        );
    }

    submitValetOrder() {
        let is_advanced_orders = false;
        let pickup_date = '';
        if (this.pickup_datetime == 'ASAP') {
            pickup_date = moment().format('YYYY-MM-DD HH:mm');
        } else {
            is_advanced_orders = true;
            pickup_date = moment(
                this.pickup_datetime,
                'D MMM YYYY h:mm A'
            ).format('YYYY-MM-DD HH:mm');
        }

        let recipient_list = new Array();
        let drop_off = this.dropoff_points;
        for (var i = 0; i < this.dropoff_points.length; i++) {
            recipient_list.push({
                recipient_name: '',
                recipient_phone: '',
                recipient_address: drop_off[i].address,
                recipient_postal_code: drop_off[i].postal,
            });
        }

        const url = SERVER_URL + 'api/new-order-valet';
        const params = new HttpParams()
            .set('token', this.token)
            .set('username', this.account.username)
            .set('pickup_address', this.sender_location)
            .set('pickup_postal_code', this.sender_postal_code)
            .set('pickup_date', pickup_date)
            .set('vehicle_plate_number', this.car_plate)
            .set('vehicle_transmission', this.vehicle_transmission)
            .set('sender_name', this.sender_name)
            .set('sender_contact', this.sender_contact)
            .set('remarks', this.remarks)
            .set('payment_method', this.payment_method)
            .set('is_advanced_orders', is_advanced_orders.toString())
            .set('recipient_list', JSON.stringify(recipient_list));

        this.httpClient.post(url, params).subscribe(
            async (response) => {
                let json_data = response;
                if (json_data['status_code'] == 200) {
                    this.clearAll();
                    this.router.navigate([
                        '/flash-page/' + json_data['tracking_number'],
                    ]);
                } else {
                    alert(json_data['description']);
                }
            },
            async (error) => {
                alert('Error' + error.error);
            }
        );
    }

    sendVerificationEmail() {
        const url = SERVER_URL + 'api/send/verification-email';
        const params = new HttpParams()
            .set('token', this.token)
            .set('username', this.account.username)
            .set('role_type', 'customer');

        this.httpClient.post(url, params).subscribe(
            (response) => {
                console.log(response);
                let json_data = response;
                if (json_data['status_code'] == 200) {
                    alert('Verification email has been sent.');
                }
            },
            (error) => {
                alert('Please check your internet connection and try again.');
            }
        );
    }

    topup() {
        const url = SERVER_URL + 'api/merchant-topup';
        const params = new HttpParams()
            .set('token', this.token)
            .set('username', this.account.username)
            .set('topup_amount', this.top_up_amount.toString());
        console.log(params);

        this.httpClient.post(url, params).subscribe(
            async (response) => {
                let json_data = response;
                console.log(response);
                if (json_data['status_code'] == 200) {
                    this.getProfile();
                    this.clearAll();
                    this.router.navigate(['/tabs/tab-menu']);
                }
            },
            async (error) => {
                alert('Error' + error.error);
            }
        );
    }

    clearAll() {
        this.pickup_datetime = 'ASAP';
        this.payment_method = 'cash';
        this.remarks = '';
        this.order_detail = {
            order_type: '',
            icon: '',
            tracking_number: '',
            pickup_address: '',
            pickup_postal_code: '',
            pickup_unit_number: '',
            pickup_name: '',
            pickup_contact: '',
            delivery_distance: '',
            date: '',
            status: '',
            package_type: '',
            package_weight: '',
            est_pickup_time: '',
            est_delivery_time: '',
            type_of_vehicle_id: '',
            vehicle_plate_number: '',
            vehicle_transmission: '',
            charge_amount: '',
            remarks: '',
            recipients: [],
            surcharge: [],
            deliveryPrice: 0,
            is_feedback_received: false,
        };
        this.top_up_amount = 0;

        //parcel
        this.sender_postal_code = '';
        this.sender_location = '';
        this.sender_name = '';
        this.sender_contact = '';

        this.dropoff_points = new Array();
        this.vehicle = new Array();
        this.parcel_type = '';
        this.parcel_type_others = '';

        this.dropoff_points.push({
            receiver_postal_code: '',
            receiver_location: '',
            receiver_name: '',
            receiver_contact: '',
            receiver_location_text: 'Where to...',
        });

        if (this.profile) {
            this.sender_postal_code = this.profile.postal_code;
            this.sender_location = this.profile.address;
            this.sender_name = this.profile.name;
            this.sender_contact = this.profile.phone;
            this.sender_location_text =
                'Sending from ' +
                this.sender_location +
                ' Singapore ' +
                this.sender_postal_code;
        } else {
            this.sender_location_text = 'Set sending location';
        }
    }

    loadOrders(event) {
        if (this.start == 0) {
            this.nodata = false;
            this.loading = true;

            if (event == null) {
                event = this.ev;
            }

            if (event) {
                if (event instanceof IonInfiniteScroll) {
                    this.ev = event;
                    event.disabled = false;
                } else {
                    event.target.disabled = false;
                }
            }
        }

        const url = SERVER_URL + 'api/get/my-orders';
        const params = new HttpParams()
            .set('token', this.token)
            .set('username', this.account.username)
            .set('start', this.start.toString())
            .set('limit', '10')
            .set('state', 'active');

        this.items = this.dummyData.items;
        this.nodata = false;
        this.loading = false;
    }
}
