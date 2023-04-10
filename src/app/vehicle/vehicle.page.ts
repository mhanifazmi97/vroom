import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment, SERVER_URL } from '../../environments/environment';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

import { GlobalVars } from './../providers/globalVars';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.page.html',
  styleUrls: ['./vehicle.page.scss'],
})
export class VehiclePage {
	form: FormGroup;
	load = false;

	constructor(private storage: Storage, private router: Router, private httpClient: HttpClient, public globalVars: GlobalVars, private formBuilder: FormBuilder) {
		this.form = new FormGroup({
			car_plate: new FormControl(this.globalVars.profile.car_plate, Validators.compose([
				Validators.required
			])),
			vehicle_transmission: new FormControl(this.globalVars.profile.vehicle_transmission, Validators.compose([
				Validators.required
			]))
		});
	}
	
	ionViewWillEnter(){
		this.form = new FormGroup({
			car_plate: new FormControl(this.globalVars.profile.car_plate, Validators.compose([
				Validators.required
			])),
			vehicle_transmission: new FormControl(this.globalVars.profile.vehicle_transmission, Validators.compose([
				Validators.required
			]))
		});
	}
	
	public errorMessages = {
		car_plate:[
			{ type:'required', message:'Number plate is required' }
		],
		vehicle_transmission:[
			{ type:'required', message:'Vehicle transmission is required' }
		]
	}
	
	get car_plate(){
		return this.form.get('car_plate');
	}
	
	get vehicle_transmission(){
		return this.form.get('vehicle_transmission');
	}
	
	save() {
		this.load = true;
		
		const url = SERVER_URL + "api/update/profile-data";
		let params = new HttpParams()
			.set('token', this.globalVars.token)
			.set('username', this.globalVars.account.username)
			.set('car_plate', this.form.controls.car_plate.value)
			.set('vehicle_transmission', this.form.controls.vehicle_transmission.value);
				
		this.httpClient.post(url, params)
			.subscribe(async (response) => {
				let json_data = response;
				
				alert(json_data['description']);
				if( json_data['status_code'] == 200 ) {
					this.globalVars.getProfile();
					this.router.navigate(['/tabs/tab-menu']);
				}
				this.load = false;
				
			}, async (error) => {alert(error.error);this.load = false;}
		);
	}
}

