import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flash-page',
  templateUrl: './flash-page.page.html',
  styleUrls: ['./flash-page.page.scss'],
})
export class FlashPagePage {
	tracking_number = '';
	constructor(private router: Router, private activatedRoute: ActivatedRoute) {
		this.tracking_number = this.activatedRoute.snapshot.paramMap.get('tracking_number');
		
		setTimeout(() => {
			this.router.navigate(['/tabs/tab-order']);
		}, 5000);
	}
}
