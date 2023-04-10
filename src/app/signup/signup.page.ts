import { Component, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { environment, SERVER_URL } from '../../environments/environment';
import { AuthenticationService } from '../services/authentication.service';
import * as uuid from 'uuid';

import { GlobalVars } from './../providers/globalVars';
import { EmailValidator } from '../../validators/email.validator';
import { MobileValidator } from '../../validators/mobile.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
	@ViewChild('otpfull') otpfull: IonInput;

	public form: FormGroup;
	public load = false;
	public otpVerifyFail = false;
	public view = 'signup';
	public otpfullvalue = '';
	public otp_code = '';
	public counter = 60;
	public otp_timer: any;

	constructor(private authService: AuthenticationService, private httpClient: HttpClient, public globalVars: GlobalVars, private formBuilder: FormBuilder, private iab: InAppBrowser) {
		this.form = new FormGroup({
			name: new FormControl('', Validators.compose([Validators.required])),
			mobile: new FormControl(
				'',
				Validators.compose([
					Validators.required,
					Validators.pattern(/^[0-9]\d*$/),
					Validators.minLength(8),
					MobileValidator.validMobile,
				])
			),
			email: new FormControl(
				'',
				Validators.compose([
					Validators.required,
					Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
					EmailValidator.validEmail,
				])
			),
			password: new FormControl('', Validators.compose([Validators.required])),
			address: new FormControl(''),
			postal_code: new FormControl(''),
			term: new FormControl(false, Validators.compose([Validators.requiredTrue]))
		});
	}

	ionViewWillEnter() {
		this.otp_code = uuid.v4();
		this.otpVerifyFail = false;
		this.view = 'signup';
		this.load = false;
	}

	public errorMessages = {
		name: [
			{ type: 'required', message: 'Name is required' },
			{
				type: 'maxlength',
				message: "Name can't be longer than 100 characters",
			},
		],
		email: [
			{ type: 'required', message: 'Email is required' },
			{ type: 'pattern', message: 'Please enter a valid email address' },
			{
				type: 'validEmail',
				message: 'This email is not available, choose a different email',
			},
		],
		mobile: [
			{ type: 'required', message: 'Phone number is required' },
			{ type: 'pattern', message: 'Please enter a valid phone number' },
			{
				type: 'minlength',
				message: 'Phone number should be min 8 characters long.',
			},
			{
				type: 'validMobile',
				message:
				  'This phone number is not available, choose a different phone number',
			},
		],
		password: [{ type: 'required', message: 'Password is required' }],
		address: [{ type: 'required', message: 'Address is required' }],
		postal_code: [
			{ type: 'required', message: 'Postal code is required' },
			{ type: 'pattern', message: 'Please enter a valid postal code' },
			{
				type: 'minlength',
				message: 'Postal code should be min 6 characters long.',
			},
		],
		term: [{ type: 'required', message: 'Accept terms and conditions is required' }],
	};

	get name() {
		return this.form.get('name');
	}

	get email() {
		return this.form.get('email');
	}

	get mobile() {
		return this.form.get('mobile');
	}

	get password() {
		return this.form.get('password');
	}

	get address() {
		return this.form.get('address');
	}

	get postal_code() {
		return this.form.get('postal_code');
	}
	
	get term() {
		return this.form.get('term');
	}

	checkUnique(type) {
		const url = SERVER_URL + 'api/check-signup-unique';
		let params = new HttpParams()
			.set('token', this.globalVars.token)
			.set('email', this.form.controls.email.value);

		if (type == 'phone') {
			params = new HttpParams()
				.set('token', this.globalVars.token)
				.set('phone', this.form.controls.mobile.value);
		}

		this.httpClient.post(url, params).subscribe((response) => {
			let json_data = response;
			if (json_data['status_code'] == 200) {
				if (type == 'email') {
					EmailValidator.valid = true;
					this.email.updateValueAndValidity();
				} else {
					MobileValidator.valid = true;
					this.mobile.updateValueAndValidity();
				}
			} else {
				if (type == 'email') {
					EmailValidator.valid = false;
					this.email.updateValueAndValidity();
				} else {
					MobileValidator.valid = false;
					this.mobile.updateValueAndValidity();
				}
			}
		},(error) => {
			if (type == 'email') {
				EmailValidator.valid = true;
				this.email.updateValueAndValidity();
			} else {
				MobileValidator.valid = true;
				this.mobile.updateValueAndValidity();
			}
		});
	}

	otp() {
		this.load = true;
		const url = SERVER_URL + 'api/send/sms-otp';
		const params = new HttpParams()
			.set('token', this.globalVars.token)
			.set('phone', this.form.controls.mobile.value)
			.set('purpose', 'sign_up')
			.set('requester', 'customer');
		this.httpClient.post(url, params).subscribe((response) => {
			console.log(response);
			let json_data = response;
			if (json_data['status_code'] == 200) {
				//alert(json_data['otp_code']);
				this.otp_code = json_data['otp_code'];
				this.view = 'otp';
				this.counter = 60;
				this.otp_timer = setInterval(() => {
					this.counter -= 1;
					if (this.counter == 0) {
						clearInterval(this.otp_timer);
					}
				}, 1000);

				let tmp = setInterval(() => {
					clearInterval(tmp);
					this.otpfull.setFocus();
				}, 1000);
			}
			
			this.load = false;
		},(error) => {
			alert('OTP-SMS Error, Please try again.');
			alert(error.error);
			this.load = false;
		});
	}

	otp_verify() {
		this.otpVerifyFail = false;
		if(this.otpfullvalue.toString().length == 6){
			if (this.otpfullvalue.toString() == this.otp_code.toString()) {
				this.otpfullvalue = '';
				this.register();
			} else {
				this.otpVerifyFail = true;
			}
		}
	}

	otp_close() {
		clearInterval(this.otp_timer);
		this.view = 'signup';
	}
	
	numberOnlyValidation(event: any) {
		const pattern = /[0-9]/;
		let inputChar = String.fromCharCode(event.charCode);

		if (!pattern.test(inputChar)) {
			// invalid character, prevent input
			event.preventDefault();
		}
	}

	register() {
		this.load = true;

		const url = SERVER_URL + 'api/merchant-signup';
		const params = new HttpParams()
			.set('token', this.globalVars.token)
			.set('name', this.form.controls.name.value)
			.set('email', this.form.controls.email.value)
			.set('username', this.form.controls.email.value)
			.set('password', this.form.controls.password.value)
			.set('phone', this.form.controls.mobile.value)
			.set('address', this.form.controls.address.value)
			.set('postal_code', this.form.controls.postal_code.value)
			.set('registration_id', this.globalVars.registrationId);

		this.httpClient.post(url, params).subscribe(async (response) => {
			let json_data = response;
			if (json_data['status_code'] == 200) {
				this.authService.login(
					this.form.controls.email.value,
					this.form.controls.password.value
				);
			} else {
				//alert(json_data['description']);
				this.load = false;
			}
		}, async (error) => {
			alert(error.error);
			this.load = false;
		});
	}
	
	agreement(){
		this.iab.create(SERVER_URL + 'agreement', '_blank');
	}
}
