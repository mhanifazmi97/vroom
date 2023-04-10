import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalVars } from './../providers/globalVars';
import { DummyData } from './../providers/dummyData';
import { environment, SERVER_URL } from '../../environments/environment';
import * as moment from 'moment';

import { PickerController } from '@ionic/angular';
import { PickerOptions } from '@ionic/core';

@Component({
    selector: 'app-parcel',
    templateUrl: './parcel.page.html',
    styleUrls: ['./parcel.page.scss'],
})
export class ParcelPage {
    @ViewChild('input', { static: false }) inputElement: IonInput;

    public loading = false;

    minTime = '';
    maxTime = '';
    select_datetime = 'ASAP';
    later_datetime = '';

    date_picker_option = new Array();
    hour_picker_option = new Array();
    minute_picker_option = new Array();
    am_pm_option = new Array();

    async showPicker() {
        let options: PickerOptions = {
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                },
                {
                    text: 'Ok',
                    handler: (value: any) => {
                        console.log(value);
                    },
                },
            ],
            columns: [
                {
                    name: 'date_option',
                    options: this.date_picker_option,
                },
                {
                    name: 'hour_option',
                    options: this.hour_picker_option,
                },
            ],
        };

        let picker = await this.pickerController.create(options);
        picker.present();
    }

    customPickerOptions = {
        buttons: [
            {
                text: 'Cancel',
                role: 'cancel',
                handler: () => {
                    if (this.later_datetime == '') {
                        this.setDatetime('ASAP');
                    }
                },
            },
            {
                text: 'OK',
                handler: (ev) => {
                    this.later_datetime =
                        ev.day.text +
                        ' ' +
                        ev.month.text +
                        ' ' +
                        ev.year.text +
                        ' ' +
                        ev.hour.text +
                        ':' +
                        ev.minute.text +
                        ' ' +
                        ev.ampm.text;
                    let diff = moment().diff(
                        moment(this.later_datetime, 'D MMM YYYY h:mm A'),
                        'minutes'
                    );

                    if (diff > -29) {
                        alert('30 minutes later only.');
                        this.later_datetime = moment()
                            .add(30, 'minutes')
                            .format('D MMM YYYY h:mm A');
                    }
                },
            },
        ],
    };

    vehicles = new Array();

    step = 1;

    current_receiver: any;
    receiver_postal_code = '';
    receiver_location = '';
    receiver_unit = '';
    receiver_name = '';
    receiver_contact = '';
    receiver_text = '';
    is_van = false;
    is_round_trip = false;
    allFilled = false;
    search = '';
    addressList = new Array();

    constructor(
        private httpClient: HttpClient,
        public globalVars: GlobalVars,
        public dummyData: DummyData,
        private pickerController: PickerController
    ) {
        this.globalVars.trip = 'One Way';
        this.step = 1;
        this.globalVars.vehicle = null;
        this.globalVars.parcel_type = '';

        this.globalVars.dropoff_points = new Array();
        this.globalVars.dropoff_points.push({
            receiver_postal_code: '',
            receiver_location: '',
            receiver_unit: '',
            receiver_name: '',
            receiver_contact: '',
        });

        if (this.globalVars.profile) {
            this.globalVars.sender_postal_code =
                this.globalVars.profile.postal_code;
            this.globalVars.sender_location = this.globalVars.profile.address;
            this.globalVars.sender_unit = this.globalVars.profile.unit_number;
            this.globalVars.sender_name = this.globalVars.profile.name;
            this.globalVars.sender_contact = this.globalVars.profile.phone;
        } else {
            this.globalVars.sender_location_text = 'Set sending location';
        }

        this.hour_picker_option = new Array();
        this.minute_picker_option = new Array();
        this.am_pm_option = [
            { text: 'AM', value: 'AM' },
            { text: 'PM', value: 'PM' },
        ];

        for (let i = 1; i <= 60; i++) {
            if (i <= 12) {
                this.hour_picker_option.push({
                    text: i,
                    value: i,
                });
            }

            this.minute_picker_option.push({
                text: i,
                value: i,
            });
        }
    }

    ionViewWillEnter() {
        this.date_picker_option = new Array();
        for (let i = 0; i < 8; i++) {
            this.date_picker_option.push({
                text: moment().add(i, 'days').format('ddd, MMM D'),
                value: moment().add(i, 'days').format('YYYY-MM-DD'),
            });
        }

        this.minTime = moment().format('YYYY-MM-DD');
        this.maxTime = moment().add(30, 'days').format('YYYY-MM-DD');
    }

    isInteger(val) {
        var x;
        return !(isNaN(val) ? !1 : ((x = parseFloat(val)), (0 | x) === x));
    }

    setDatetime(d) {
        this.select_datetime = d;
    }

    searchAddress() {
        this.addressList = new Array();

        this.httpClient
            .get(
                'https://developers.onemap.sg/commonapi/search?searchVal=' +
                    encodeURI(this.search) +
                    '&returnGeom=Y&getAddrDetails=Y&pageNum=1'
            )
            .subscribe(
                (response) => {
                    let json_data = response;
                    if (json_data['found'] > 0) {
                        let tmp_items = json_data['results'];
                        if (tmp_items instanceof Array) {
                            for (let value of tmp_items) {
                                if (value.POSTAL && value.POSTAL != 'NIL') {
                                    this.addressList.push({
                                        address: value.ADDRESS,
                                        postal: value.POSTAL,
                                        building: value.BUILDING,
                                    });
                                }
                            }
                        }
                    }
                },
                (error) => {}
            );
    }

    selectAddress(address) {
        this.receiver_postal_code = address.postal;
        this.receiver_location = address.address;
        this.search = '';
        //this.addressList = new Array();
    }

    formatDate(date) {
        let dateFormat = new Date(date);
        const [month, day, year] = [
            dateFormat.getMonth(),
            dateFormat.getDate(),
            dateFormat.getFullYear(),
        ];
        const [hour, minutes, seconds] = [
            dateFormat.getHours(),
            dateFormat.getMinutes(),
            dateFormat.getSeconds(),
        ];

        return `${year}-${month + 1}-${day} ${hour}:${minutes}`;
    }

    loadVehicles() {
        this.loading = true;
        this.vehicles = new Array();

        let pickup_date;
        if (this.globalVars.pickup_datetime === 'ASAP') {
            pickup_date = this.formatDate(new Date());
            console.log('ASAP pickupDate', pickup_date);
        } else {
            pickup_date = this.formatDate(this.globalVars.pickup_datetime);
            console.log('pickupDate', pickup_date);
        }

        let dropoff_points = new Array();
        for (let i = 0; i < this.globalVars.dropoff_points.length; i++) {
            let point = this.globalVars.dropoff_points[i];
            dropoff_points.push(point.receiver_postal_code);
        }

        for (let i = 0; i < this.dummyData.vehicles.length; i++) {
            let point = this.dummyData.vehicles[i];
            let deliveryPriceCalculation = point.price_amount;

            if (this.globalVars.parcel_type == 'Others') {
                this.is_van = true;
            } else {
                this.is_van = false;
            }
            if (
                this.globalVars.parcel_type == 'Others' &&
                point['type_of_vehicle_name'] != 'Van'
            )
                continue;

            for (let surcharge in point.surcharge) {
                console.log('surcharge', point.surcharge[surcharge].amount);
                deliveryPriceCalculation -= point.surcharge[surcharge].amount;
            }
            let deliveryPrice = deliveryPriceCalculation.toFixed(2);
            this.vehicles.push({
                id: point.type_of_vehicle_id,
                icon: 'data:image/png;base64,' + point.icon_image,
                name: point.type_of_vehicle_name,
                description: point.short_description,
                price: point.price_amount,
                distance: point.delivery_distance,
                limit: point.package_details,
                mover: point.mover,
                surcharge: point.surcharge,
                deliveryPrice: deliveryPrice,
            });
        }

        if (this.vehicles) {
            this.globalVars.vehicle = this.vehicles[0];
            console.log('vehicle', this.globalVars.vehicle);
        }

        this.loading = false;
    }

    addPoint() {
        this.globalVars.dropoff_points.push({
            receiver_postal_code: '',
            receiver_location: '',
            receiver_unit: '',
            receiver_name: '',
            receiver_contact: '',
        });

        this.checkAllFilled();
    }

    removePoint(point) {
        this.globalVars.dropoff_points.forEach((element, index) => {
            if (element == point)
                this.globalVars.dropoff_points.splice(index, 1);
        });

        if (this.globalVars.dropoff_points.length == 0) {
            this.addPoint();
        }

        this.checkAllFilled();
    }

    checkAllFilled() {
        let filled = true;
        for (let i = 0; i < this.globalVars.dropoff_points.length; i++) {
            let tmp = this.globalVars.dropoff_points;
            if (tmp[i].receiver_postal_code == '') {
                filled = false;
            }
        }

        this.allFilled = filled;
    }

    set(value, point) {
        if (value == 'sender') {
            this.step = 2;
        } else if (value == 'receiver') {
            this.current_receiver = point;
            this.receiver_postal_code = point.receiver_postal_code;
            this.receiver_location = point.receiver_location;
            this.receiver_unit = point.receiver_unit;
            this.receiver_name = point.receiver_name;
            this.receiver_contact = point.receiver_contact;

            for (let i = 0; i < this.globalVars.dropoff_points.length; i++) {
                let tmp = this.globalVars.dropoff_points;
                if (tmp[i] == point) {
                    if (this.globalVars.dropoff_points.length > 1) {
                        this.receiver_text = 'Recipient Details ' + (i + 1);
                    } else {
                        this.receiver_text = 'Recipient Details';
                    }
                    break;
                }
            }

            this.step = 3;
        } else if (value == 'package') {
            this.step = 4;
        } else if (value == 'vehicles') {
            this.loadVehicles();
            this.step = 5;
        } else if (value == 'datetime') {
            this.step = 6;
        }
    }

    back(step) {
        this.step = step;
    }

    set_sender() {
        this.step = 1;
    }

    set_receiver() {
        this.current_receiver.receiver_postal_code = this.receiver_postal_code;
        this.current_receiver.receiver_location = this.receiver_location;
        this.current_receiver.receiver_unit = this.receiver_unit;
        this.current_receiver.receiver_name = this.receiver_name;
        this.current_receiver.receiver_contact = this.receiver_contact;

        this.checkAllFilled();
        this.step = 1;
    }

    setVehicle(vehicle) {
        this.globalVars.vehicle = vehicle;
        if (vehicle.name == 'Van') {
            this.is_van = true;
        } else {
            this.is_van = false;
        }
    }

    setDuration(duration) {
        this.globalVars.duration = duration;
    }

    setPackage(parcel_type) {
        this.globalVars.parcel_type = parcel_type;
        if (parcel_type == 'Others') {
            setTimeout(() => {
                this.inputElement.setFocus();
            }, 400);
        }
    }

    setTrip(trip) {
        this.globalVars.trip = trip;
    }

    setSchedule() {
        if (this.select_datetime == 'ASAP') {
            this.globalVars.pickup_datetime = this.select_datetime;
        } else {
            this.globalVars.pickup_datetime = this.later_datetime;
        }
        this.step = 1;
    }
}
