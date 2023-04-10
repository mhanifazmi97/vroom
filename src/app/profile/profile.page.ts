import { Component, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { environment, SERVER_URL } from '../../environments/environment';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import * as uuid from 'uuid';
import { AuthenticationService } from '../services/authentication.service';

import { GlobalVars } from './../providers/globalVars';
import { EmailValidator } from '../../validators/email.validator';
import { MobileValidator } from '../../validators/mobile.validator';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
	@ViewChild('otpfull') otpfull: IonInput;
	
	public form: FormGroup;
	public load = false;
	public otpVerifyFail = false;
	public view = 'profile';
	public otpfullvalue = '';
	public otp_code = '';
	public counter = 60;
	public otp_timer:any;
	public profile_picture:any;
	
	constructor(private storage: Storage, private router: Router, private httpClient: HttpClient, public globalVars: GlobalVars, private formBuilder: FormBuilder, private camera: Camera, private authService: AuthenticationService) {
		this.form = new FormGroup({
			name: new FormControl(this.globalVars.profile.name, Validators.compose([
				Validators.required
			])),
			mobile: new FormControl(this.globalVars.profile.phone, Validators.compose([
				Validators.required,
				Validators.pattern(/^[0-9]\d*$/),
				Validators.minLength(8),
				MobileValidator.validMobile
			])),
			email: new FormControl(this.globalVars.profile.email, Validators.compose([
				Validators.required,
				Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
				EmailValidator.validEmail
			])),
			address: new FormControl(this.globalVars.profile.address, Validators.compose([
				Validators.required
			])),
			unit_number: new FormControl(this.globalVars.profile.unit_number),
			postal_code: new FormControl(this.globalVars.profile.postal_code, Validators.compose([
				Validators.required,
				Validators.pattern(/^[0-9]\d*$/),
				Validators.minLength(6)
			]))
		});
	}
	
	ionViewWillEnter(){
		this.otp_code = uuid.v4();
		this.form = new FormGroup({
			name: new FormControl(this.globalVars.profile.name, Validators.compose([
				Validators.required
			])),
			mobile: new FormControl(this.globalVars.profile.phone, Validators.compose([
				Validators.required,
				Validators.pattern(/^[0-9]\d*$/),
				Validators.minLength(8),
				MobileValidator.validMobile
			])),
			email: new FormControl(this.globalVars.profile.email, Validators.compose([
				Validators.required,
				Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
				EmailValidator.validEmail
			])),
			address: new FormControl(this.globalVars.profile.address, Validators.compose([
				Validators.required
			])),
			unit_number: new FormControl(this.globalVars.profile.unit_number),
			postal_code: new FormControl(this.globalVars.profile.postal_code, Validators.compose([
				Validators.required,
				Validators.pattern(/^[0-9]\d*$/),
				Validators.minLength(6)
			]))
		});
		
		this.profile_picture = this.globalVars.profile.profile_picture;
	}
	
	public errorMessages = {
		name:[
			{ type:'required', message:'Name is required' },
			{ type:'maxlength', message:'Name can\'t be longer than 100 characters' }
		],
		email:[
			{ type:'required', message:'Email is required' },
			{ type:'pattern', message:'Please enter a valid email address' },
			{ type:'validEmail', message:'This email is not available, choose a different email' }
		],
		mobile:[
			{ type:'required', message:'Phone number is required' },
			{ type:'pattern', message:'Please enter a valid phone number' },
			{ type:'minlength', message:'Phone number should be min 8 characters long.' },
			{ type:'validMobile', message:'This phone number is not available, choose a different phone number' }
		],
		password:[
			{ type:'required', message:'Password is required' }
		],
		address:[
			{ type:'required', message:'Address is required' }
		],
		postal_code:[
			{ type:'required', message:'Postal code is required' },
			{ type:'pattern', message:'Please enter a valid postal code' },
			{ type:'minlength', message:'Postal code should be min 6 characters long.' }
		]
	}
	
	get name(){
		return this.form.get('name');
	}
	
	get email(){
		return this.form.get('email');
	}
	
	get mobile(){
		return this.form.get('mobile');
	}
	
	get address(){
		return this.form.get('address');
	}
	
	get postal_code(){
		return this.form.get('postal_code');
	}
	
	checkUnique(type) {
		const url = SERVER_URL + "api/check-signup-unique";
		let params = new HttpParams()
						.set('token', this.globalVars.token)
						.set('email', this.form.controls.email.value);
			
		if(type == 'phone'){
			params = new HttpParams()
						.set('token', this.globalVars.token)
						.set('phone', this.form.controls.mobile.value);
						
			if(this.form.controls.mobile.value == this.globalVars.profile.phone){
				MobileValidator.valid = true;
				this.mobile.updateValueAndValidity();
				return;
			}
		}else{
			if(this.form.controls.email.value == this.globalVars.profile.email){
				EmailValidator.valid = true;
				this.email.updateValueAndValidity();
				return;
			}
		}
		
		this.httpClient.post(url, params)
			.subscribe(response => {
				let json_data = response;
				if( json_data['status_code'] == 200 ) {
					if(type == 'email'){
						EmailValidator.valid = true;
						this.email.updateValueAndValidity();
					}else{
						MobileValidator.valid = true;
						this.mobile.updateValueAndValidity();
					}
				}else{
					if(type == 'email'){
						EmailValidator.valid = false;
						this.email.updateValueAndValidity();
					}else{
						MobileValidator.valid = false;
						this.mobile.updateValueAndValidity();
					}
				}
				
				
			}, error => {
				if(type == 'email'){
					EmailValidator.valid = true;
					this.email.updateValueAndValidity();
				}else{
					MobileValidator.valid = true;
					this.mobile.updateValueAndValidity();
				}
			}
		);
	}
	
	otp() {
		if(this.form.controls.mobile.value != this.globalVars.profile.phone){
			this.load = true;
			const url = SERVER_URL + "api/send/sms-otp";
			const params = new HttpParams()
				.set('token', this.globalVars.token)
				.set('phone', this.form.controls.mobile.value)
				.set('purpose', 'sign_up')
				.set('requester', 'customer');
			
			this.httpClient.post(url, params)
				.subscribe(response => {
					console.log(response);
					let json_data = response;
					if( json_data['status_code'] == 200 ) {
						this.otp_code = json_data['otp_code'];
						this.view = 'otp';
						
						this.counter = 60;
						this.otp_timer = setInterval( () => {
							this.counter -= 1;
							if (this.counter == 0) {
								clearInterval(this.otp_timer);
							}
						}, 1000);
						
						let tmp = setInterval( () => {
							clearInterval(tmp);
							this.otpfull.setFocus();
						}, 1000);
					}
					this.load = false;
				}, error => {alert('Please check your internet connection and try again.');this.load = false;}
			);
		}else{
			this.save();
		}
	}
	
	otp_verify() {
		this.otpVerifyFail = false;
		if(this.otpfullvalue.toString().length == 6){
			if (this.otpfullvalue.toString() == this.otp_code.toString()) {
				this.otpfullvalue = '';
				this.save();
			} else {
				this.otpVerifyFail = true;
			}
		}
	}
	
	otp_close() {
		clearInterval(this.otp_timer);
		this.view = 'profile';
	}
	
	numberOnlyValidation(event: any) {
		const pattern = /[0-9]/;
		let inputChar = String.fromCharCode(event.charCode);

		if (!pattern.test(inputChar)) {
			// invalid character, prevent input
			event.preventDefault();
		}
	}
	
	deleteaccount() {
		alert("You're deleting your account, this cannot be undone");
		const url = SERVER_URL + "api/user/delete";
		const params = new HttpParams()
			.set('token', this.globalVars.token)
			.set('username', this.globalVars.account.username);
		
		this.httpClient.post(url, params)
			.subscribe(response => {
				console.log(response);
				let json_data = response;
				if( json_data['status_code'] == 200 ) {
					alert('Your account successfully deleted');
					this.authService.logout();
				}  else {
					alert('An unexpected error occurred, please contact support team.');
				}
			
			}, error => {alert('An unexpected error occurred, please contact support team.');}
		);

    }
	
	save() {
		this.load = true;
		
		const url = SERVER_URL + "api/update/profile-data";
		let params = new HttpParams()
			.set('token', this.globalVars.token)
			.set('username', this.globalVars.account.username)
			.set('name', this.form.controls.name.value)
			.set('address', this.form.controls.address.value)
			.set('unit_number', this.form.controls.unit_number.value)
			.set('postal_code', this.form.controls.postal_code.value)
			.set('role_type', 'customer');
		
		if(this.form.controls.mobile.value != this.globalVars.profile.phone){
			params = params.append('phone', this.form.controls.mobile.value);
		}
		if(this.form.controls.email.value != this.globalVars.profile.email){
			params = params.append('email', this.form.controls.email.value);
		}
		if(this.profile_picture != this.globalVars.profile.profile_picture){
			params = params.append('profile_picture', this.profile_picture);
		}
				
		this.httpClient.post(url, params)
			.subscribe(async (response) => {
				let json_data = response;
				alert(json_data['description']);
				if( json_data['status_code'] == 200 ) {
					if(this.form.controls.email.value != this.globalVars.profile.email){
						this.globalVars.account.username = this.form.controls.email.value
						await this.storage.set(this.globalVars.token_value, this.globalVars.account);
					}
					this.globalVars.getProfile();
					this.router.navigate(['/tabs/tab-menu']);
				}
				this.load = false;
				
			}, async (error) => {alert(error.error);this.load = false;}
		);
	}
	
	openCamera(){
		const options: CameraOptions = {
			quality: 100,
			targetWidth: 400,
			targetHeight: 400,
			allowEdit: false,
			destinationType: this.camera.DestinationType.DATA_URL,
			encodingType: this.camera.EncodingType.JPEG,
			mediaType: this.camera.MediaType.PICTURE,
			cameraDirection: this.camera.Direction.FRONT
		}
		
		this.camera.getPicture(options).then((imageData) => {
			this.profile_picture = imageData;
		}, (err) => {});
	}
}
