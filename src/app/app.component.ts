import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';

import { GlobalVars } from './providers/globalVars';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
	constructor(
		private router: Router,
		private platform: Platform,
		private authenticationService: AuthenticationService,
		private storage: Storage, 
		public toastController: ToastController,
		public globalVars: GlobalVars
	) {
		this.initializeApp();
	}
	
	async ngOnInit() {
		await this.storage.create();
	}
	
	initializeApp() {
		this.platform.ready().then(async() => {
			const key:any = await this.storage.get(this.globalVars.token_value);
			const key2:any = await this.storage.get(this.globalVars.token_value + '_first_time');
			if (key != null && key.role) {
				this.router.navigate(['/']);
			}else{
				if (key2 != null) {
					this.router.navigate(['/login']);
				}else{
					this.router.navigate(['/login']);
					//this.router.navigate(['/landing-page']);
				}
				
			}
		});
	}
}
