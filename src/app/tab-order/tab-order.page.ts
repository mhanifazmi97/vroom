import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { environment, SERVER_URL } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';

import { GlobalVars } from '../../app/providers/globalVars';

@Component({
    selector: 'app-tab-order',
    templateUrl: 'tab-order.page.html',
    styleUrls: ['tab-order.page.scss'],
})
export class TabOrderPage {
    @ViewChild(IonInfiniteScroll, { static: false })
    infiniteScroll: IonInfiniteScroll;

    constructor(
        private router: Router,
        private httpClient: HttpClient,
        public globalVars: GlobalVars
    ) {}

    ionViewWillEnter() {
        this.globalVars.items = new Array();
        this.globalVars.start = 0;
        this.globalVars.loadOrders(this.infiniteScroll);
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    details(item) {
        this.globalVars.order_detail = item;
        this.router.navigate(['/order-details']);
    }

    sendVerificationEmail() {
        this.globalVars.sendVerificationEmail();
    }
}
