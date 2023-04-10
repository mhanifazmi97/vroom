import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { environment, SERVER_URL } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';

import { GlobalVars } from '../../app/providers/globalVars';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.page.html',
  styleUrls: ['./order-history.page.scss'],
})
export class OrderHistoryPage {
  @ViewChild(IonInfiniteScroll, { static: false })
  infiniteScroll: IonInfiniteScroll;
  public items = new Array();
  public start = 0;
  public nodata = false;
  public loading = true;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    public globalVars: GlobalVars
  ) {}

  ionViewWillEnter() {
    this.items = new Array();
    this.start = 0;
    this.loadOrders();
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  loadOrders() {
    if (this.start == 0) {
      this.nodata = false;
      this.loading = true;
      this.infiniteScroll.disabled = false;
    }

    const url = SERVER_URL + 'api/get/my-orders';
    const params = new HttpParams()
      .set('token', this.globalVars.token)
      .set('username', this.globalVars.account.username)
      .set('start', this.start.toString())
      .set('limit', '10')
      .set('state', 'completed');

    this.httpClient.post(url, params).subscribe(
      async (response) => {
        console.log(response);
        //alert(JSON.stringify(response));
        let json_data = response;
        if (json_data['status_code'] == 200) {
          let tmp_items = json_data['list_order'];

          if (tmp_items instanceof Array) {
            for (let value of tmp_items) {
              let recipients = new Array();
              if (value.recipient_list instanceof Array) {
                for (let r of value.recipient_list) {
                  recipients.push({
                    recipient_name: r.recipient_name,
                    recipient_phone: r.recipient_phone,
                    recipient_address: r.recipient_address,
                    recipient_postal_code: r.recipient_postal_code,
                    recipient_order_status: r.recipient_order_status,
                  });
                }
              }
              //calculating the delivery fee
              let deliveryPriceCalculation = +value.charge_amount;
              for (let item in value.surcharge) {
                deliveryPriceCalculation -= value.surcharge[item].amount;
              }

              this.items.push({
                order_type: value.order_type,
                icon: value.order_icon
                  ? 'data:image/png;base64,' + value.order_icon
                  : 'assets/express_valet.png',
                tracking_number: value.tracking_number,
                pickup_address: value.pickup_address,
                pickup_unit_number: value.pickup_unit_number,
                pickup_postal_code: value.pickup_postal_code,
                pickup_name: value.merchant_name,
                pickup_contact: value.pickup_contact,
                delivery_distance: value.delivery_distance,
                date: moment(value.pickup_date).format('D MMM YYYY h:mm A'),
                status: this.capitalizeFirstLetter(value.state),
                package_type: value.package_type,
                package_weight: value.package_weight,
                est_pickup_time: value.est_pickup_time,
                est_delivery_time: value.est_delivery_time,
                type_of_vehicle_id: value.type_of_vehicle_id,
                vehicle_plate_number: value.vehicle_plate_number,
                vehicle_transmission: value.vehicle_transmission,
                charge_amount: value.charge_amount,
                remarks: value.remarks,
                recipients: recipients,
                surcharge: value.surcharge,
                deliveryPrice: deliveryPriceCalculation,
                is_feedback_received: value.is_feedback_received,
              });
            }

            this.start += tmp_items.length;

            if (tmp_items.length < 10) {
              this.infiniteScroll.disabled = true; //no more data to load
            }
          } else {
            this.infiniteScroll.disabled = true; //no more data to load
          }
        } else {
          this.infiniteScroll.disabled = true; //no more data to load
        }

        this.infiniteScroll.complete();

        if (this.start == 0) {
          this.nodata = true;
        }

        this.loading = false;
      },
      async (error) => {
        alert('Encounter error when loading orders.');
        alert(JSON.stringify(error));
        this.infiniteScroll.disabled = true;
        this.loading = false;
        console.log(error.status);
        console.log(error.error); // error message as string
        console.log(error.headers);
      }
    );
  }

  details(item) {
    this.globalVars.order_detail = item;
    this.router.navigate(['/order-details']);
  }
}
