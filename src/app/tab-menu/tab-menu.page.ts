import { Component, ViewChild } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { AuthenticationService } from '../services/authentication.service';

import { GlobalVars } from './../providers/globalVars';

@Component({
  selector: 'app-tab-menu',
  templateUrl: 'tab-menu.page.html',
  styleUrls: ['tab-menu.page.scss']
})
export class TabMenuPage {
    fingerprint_authentication_available = false;
	fingerprint_authentication = true;
	version: string;

    constructor(public platform: Platform, private appVersion: AppVersion, private faio: FingerprintAIO, private storage: Storage, public globalVars: GlobalVars, private authService: AuthenticationService) {
		this.platform.ready().then(()=> {
			this.appVersion.getVersionNumber().then((res)=>{
				this.version = res;
			}, (err)=>{this.version = '';});
			
			this.faio.isAvailable().then((result: any) => {
				this.fingerprint_authentication_available = true;
			})
			.catch((error: any) => {});
		}); 
	}
	
	async ngOnInit() {
		await this.storage.create();
		const key = await this.storage.get('Fingerprint-Authentication');
		if(!key){
			this.fingerprint_authentication = false;
		}
	}

	ionViewWillEnter(){
		this.globalVars.getProfile();
	}
	
	sendVerificationEmail(){
		this.globalVars.sendVerificationEmail()
	}
	
	async updateAuthentication(){
		if(this.fingerprint_authentication && this.fingerprint_authentication_available){
			this.faio.show({
				cancelButtonTitle: 'Cancel',
				description: "Touch the fingerprint sensor zone to verify your fingerprint",
				disableBackup: true,
				title: 'Fingerprint Authentication',
				fallbackButtonTitle: 'Cancel'
			})
			.then(async (result: any) => {
				if (this.globalVars.account.role) {
					await this.storage.set('Fingerprint-Authentication', this.globalVars.account);
				}
			})
			.catch((error: any) => {
				this.fingerprint_authentication = false;
			});
		}else{
			await this.storage.set('Fingerprint-Authentication', null);
			this.fingerprint_authentication = false;
		}
	}
	
	logout(){
		this.authService.logout();
	}
}
