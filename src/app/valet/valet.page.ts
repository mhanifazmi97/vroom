import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { GlobalVars } from './../providers/globalVars';
import { environment, SERVER_URL } from '../../environments/environment';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-valet',
  templateUrl: './valet.page.html',
  styleUrls: ['./valet.page.scss'],
})
export class ValetPage {
  @ViewChild('input', { static: false }) inputElement: IonInput;

  minTime = '';
  maxTime = '';

  vehicles = new Array();

  step = 1;

  current_receiver: any;
  receiver_postal_code = '';
  receiver_location = '';
  receiver_name = '';
  receiver_contact = '';
  receiver_text = '';

  processing = false;
  allFilled = false;
  set_address = '';
  search = '';
  addressList = new Array();

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    public globalVars: GlobalVars
  ) {
    this.step = 1;
    this.globalVars.vehicle = null;

    this.globalVars.dropoff_points = new Array();
    this.globalVars.dropoff_points.push({
      address: '',
      postal: '',
      location_text: 'Set drop off location',
    });

    this.globalVars.sender_location_text = 'Set pick up location';
  }

  ionViewWillEnter() {
    let now = moment();
    let remainder = now.minute() % 15;
    let roundup_15 = 0;
    if (remainder > 0) {
      roundup_15 = 15 - remainder;
    }
    now.add(30 + roundup_15, 'minutes');

    this.minTime = now.format();
    this.maxTime = moment().add(30, 'days').format();
    this.globalVars.pickup_datetime = now.format('D MMM YYYY HH:mm');
    this.globalVars.sender_name = this.globalVars.profile.name;
    this.globalVars.sender_contact = this.globalVars.profile.phone;
    this.globalVars.car_plate = this.globalVars.profile.car_plate;
    this.globalVars.vehicle_transmission =
      this.globalVars.profile.vehicle_transmission;

    if (
      this.globalVars.car_plate === undefined ||
      this.globalVars.car_plate == ''
    ) {
      this.step = 5;
    }
  }

  isInteger(val) {
    var x;
    return !(isNaN(val) ? !1 : ((x = parseFloat(val)), (0 | x) === x));
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
    if (this.set_address == 'sender') {
      this.globalVars.sender_location = address.address;
      this.globalVars.sender_postal_code = address.postal;
      this.globalVars.sender_location_text =
        address.building + ', Singapore ' + address.postal;
    } else {
      this.current_receiver.address = address.address;
      this.current_receiver.postal = address.postal;
      this.current_receiver.location_text =
        address.building + ', Singapore ' + address.postal;
    }

    this.step = 1;
    this.checkAllFilled();
    this.addressList = new Array();
  }

  setVehicleInformation() {
    const url = SERVER_URL + 'api/update/profile-data';
    const params = new HttpParams()
      .set('token', this.globalVars.token)
      .set('username', this.globalVars.account.username)
      .set('car_plate', this.globalVars.car_plate)
      .set('vehicle_transmission', this.globalVars.vehicle_transmission);

    this.httpClient.post(url, params).subscribe(
      (response) => {
        this.globalVars.getProfile();
      },
      (error) => {}
    );

    this.step = 1;
  }

  summary() {
    let dropoff_points = new Array();
    for (let i = 0; i < this.globalVars.dropoff_points.length; i++) {
      let point = this.globalVars.dropoff_points[i];
      dropoff_points.push(point.postal);
    }

    const url = SERVER_URL + 'api/get/distance-charges-valet';
    const params = new HttpParams()
      .set('token', this.globalVars.token)
      .set('pickup_postal_code', this.globalVars.sender_postal_code)
      .set('destination_postal_code', JSON.stringify(dropoff_points))
      .set(
        'pickup_date',
        moment(this.globalVars.pickup_datetime).format('YYYY-MM-DD HH:MM')
      );

    this.httpClient.post(url, params).subscribe(
      async (response) => {
        let json_data = response;
        if (json_data['status_code'] == 200) {
          this.globalVars.fee = json_data['price_amount'];
          this.globalVars.distance = json_data['delivery_distance'];
          this.router.navigate(['/valet-summary']);
        }
        this.processing = false;
      },
      async (error) => {
        this.processing = false;
      }
    );
  }

  addPoint() {
    this.globalVars.dropoff_points.push({
      address: '',
      postal: '',
      location_text: 'Set drop off location',
    });

    this.checkAllFilled();
  }

  removePoint(point) {
    this.globalVars.dropoff_points.forEach((element, index) => {
      if (element == point) this.globalVars.dropoff_points.splice(index, 1);
    });

    this.checkAllFilled();
  }

  set(value, point) {
    this.set_address = value;

    if (value == 'sender') {
      this.search = '';
      this.step = 0;
    } else if (value == 'receiver') {
      this.search = '';
      this.current_receiver = point;
      this.step = 0;
    }
  }

  back(step) {
    this.step = step;
  }

  checkAllFilled() {
    let filled = true;
    for (let i = 0; i < this.globalVars.dropoff_points.length; i++) {
      let tmp = this.globalVars.dropoff_points;
      if (tmp[i].postal == '') {
        filled = false;
      }
    }

    this.allFilled = filled;
  }
}
