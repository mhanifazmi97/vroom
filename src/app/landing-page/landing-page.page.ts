import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Router } from '@angular/router';
import { GlobalVars } from './../providers/globalVars';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.page.html',
  styleUrls: ['./landing-page.page.scss'],
})
export class LandingPagePage {
	public slideOpts = {
		slidesPerView: 1,
		coverflowEffect: {
			rotate: 50,
			stretch: 0,
			depth: 100,
			modifier: 1,
			slideShadows: true
		}
	};
  
	constructor(public globalVars: GlobalVars, private storage: Storage, private router: Router) {
		this.storage.set(this.globalVars.token_value + '_first_time', 'first_time');
	}
	
	register(){
		this.router.navigate(['/login']);
	}
}
