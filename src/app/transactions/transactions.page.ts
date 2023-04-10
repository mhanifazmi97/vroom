import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { environment, SERVER_URL } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';

import {GlobalVars} from '../../app/providers/globalVars';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage {
@ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
    public items = new Array();
	public start = 0;
	public nodata = false;
	public loading = true;
    
    constructor(private router: Router, private httpClient: HttpClient, public globalVars: GlobalVars) {

	}
    
    ionViewWillEnter(){
		this.start = 0;
		this.nodata = false;
		this.items = new Array();
		this.loadTransactions();
	}
    
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    loadTransactions(){
		if(this.start == 0){
			this.nodata = false;
			this.loading = true;
			//this.infiniteScroll.disabled = false;
		}
						
		const url = SERVER_URL + "api/get/transaction-history";
		const params = new HttpParams()
			.set('token', this.globalVars.token)
			.set('username', this.globalVars.account.username)
			.set('start', this.start.toString())
			.set('record', "10")
			.set('role_type', 'customer');
			
		this.httpClient.post(url, params)
			.subscribe(response => {
				let json_data = response;
				
				if( json_data['status_code'] == 200 ) {
					let tmp_items = json_data['transaction_list'];
					
					if(tmp_items instanceof Array) {
						for(let value of tmp_items) {
							let color = 'green';
							if(value.credit > 0){
								color = 'red';
							}
						
							this.items.push({
								date: moment(value.date).format('D MMM YYYY h:mm A'),
								description: value.description,
								amount: (value.credit>0?value.credit:value.debit),
								color: color
							});
                        }
								
						this.start += tmp_items.length;
						
						if(tmp_items.length < 10){
							this.infiniteScroll.disabled = true; //no more data to load
						}
					}else{
						this.infiniteScroll.disabled = true; //no more data to load
					}
				}else{
					this.infiniteScroll.disabled = true; //no more data to load
				}
				
				this.infiniteScroll.complete();
						
				if(this.start == 0){
					this.nodata = true;
				}
				
				this.loading = false;
			}, error => {
				alert('Encounter error when loading transaction.');
				this.loading = false;
			}
		);
	}
}
