import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { environment, SERVER_URL } from '../../environments/environment';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AuthenticationService } from '../services/authentication.service';

import { GlobalVars } from './../providers/globalVars';

@Component({
  selector: 'app-password',
  templateUrl: './password.page.html',
  styleUrls: ['./password.page.scss'],
})
export class PasswordPage {
	form: FormGroup;
	load = false;
	
	constructor(private storage: Storage, private router: Router, private httpClient: HttpClient, public globalVars: GlobalVars, private formBuilder: FormBuilder, private authService: AuthenticationService) {
		this.form = new FormGroup({
			password: new FormControl('', Validators.compose([
				Validators.required
			])),
			repassword: new FormControl('', Validators.compose([
				Validators.required
			]))
		}, { 
			validators: this.matchingPasswords.bind(this)
		});
		
	}
	
	ionViewWillEnter(){
		this.form = new FormGroup({
			password: new FormControl('', Validators.compose([
				Validators.required
			])),
			repassword: new FormControl('', Validators.compose([
				Validators.required
			]))
		}, { 
			validators: this.matchingPasswords.bind(this)
		});
	}
	
	public errorMessages = {
		password:[
			{ type:'required', message:'Password is required' }
		],
		repassword:[
			{ type:'required', message:'Password is required' }
		]
	}
	
	get password(){
		return this.form.get('password');
	}
	
	get repassword(){
		return this.form.get('repassword');
	}
	
	matchingPasswords(formGroup: FormGroup) {
		const { value: p } = formGroup.controls['password'];
		const { value: confirmPassword } = formGroup.controls['repassword'];
		if(confirmPassword){
			return (p === confirmPassword) ? null : { passwordNotMatch: true };
		}else{
			return null;
		}
	}
	
	save() {
		this.load = true;
		const url = SERVER_URL + "api/change-password";
		let params = new HttpParams()
			.set('token', this.globalVars.token)
			.set('username', this.globalVars.account.username)
			.set('new_password', this.form.controls.password.value)
			.set('role_type', 'customer');
		
		console.log(params);
		
		this.httpClient.post(url, params)
			.subscribe(response => {
				let json_data = response;
				alert(json_data['description']);
				if( json_data['status_code'] == 200 ) {
					this.authService.logout();
				}
				this.load = false;
				
			}, error => {alert(error.error);this.load = false;}
		);
	}
}
