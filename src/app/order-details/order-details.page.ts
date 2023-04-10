import { Component } from '@angular/core';
import * as moment from 'moment';

import { GlobalVars } from './../providers/globalVars';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.page.html',
  styleUrls: ['./order-details.page.scss'],
})
export class OrderDetailsPage {
  constructor(public globalVars: GlobalVars) {}

  ionViewWillEnter() {}

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
