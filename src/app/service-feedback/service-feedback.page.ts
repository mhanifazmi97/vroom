import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment, SERVER_URL } from '../../environments/environment';
import { GlobalVars } from '../../app/providers/globalVars';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-feedback',
  templateUrl: './service-feedback.page.html',
  styleUrls: ['./service-feedback.page.scss'],
})
export class ServiceFeedbackPage {
  rate: 0;
  amount: 0;
  tags: any[];
  selectedTags: any[];
  order: any;
  order_type: string;
  details: string;
  constructor(
    private http: HttpClient,
    private globalVars: GlobalVars,
    private iab: InAppBrowser,
    private alertController: AlertController,
    private navController: NavController,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.order = this.globalVars.order_detail;
    console.log('order', this.order);

    let deliveryTags = [
      'Friendly',
      'Great Service',
      'Followed Instructions',
      'Contactless Delivery',
      'Punctual',
      'Accepted Additional Requests',
    ];

    let valetTags = [
      'Experienced Driver',
      'Great Personality',
      'Goes The Extra Mile',
      'Professional Service',
      'Punctual Driver',
    ];

    if (this.order.order_type === 'parcel') {
      this.tags = deliveryTags;
      this.order_type = 'delivery';
    }

    if (this.order.order_type === 'valet') {
      this.tags = valetTags;
      this.order_type = 'valet';
    }
  }

  submitFeedback() {
    this.serviceFeedback();
    if (this.amount !== 0) {
      this.payTip();
    }
  }

  serviceFeedback() {
    if (this.details) {
      this.selectedTags.push(this.details);
    }

    const url = SERVER_URL + 'api/order-rating-feedback';
    const params = new HttpParams()
      .set('token', this.globalVars.token)
      .set('username', this.globalVars.account.username)
      .set('tracking_number', this.order.tracking_number)
      .set('rating', this.rate)
      .set('feedback', JSON.stringify(this.selectedTags));

    this.http.post(url, params).subscribe(
      (response) => {
        console.log(response);
        let json_data = response;
        if (json_data['status_code'] == 200) {
          console.log('Service feedback successfully sent');
          this.presentAlert('Service feedback successfully sent');
        }
      },
      (error) => {
        this.presentAlert('Encounter error when sending feedback.');
      }
    );
  }

  payTip() {
    const url = SERVER_URL + 'api/pay/credit-card-payment';
    const params = new HttpParams()
      .set('token', this.globalVars.token)
      .set('username', this.globalVars.account.username)
      .set('amount', this.amount)
      .set('tracking_number', this.order.tracking_number);

    this.http.post(url, params).subscribe(
      (response) => {
        console.log(response);
        let json_data = response;
        if (json_data['status_code'] == 200) {
          let payment_url = json_data['payment_url'];
          if (payment_url) {
            this.iab.create(payment_url, '_blank');
          }
        }
      },
      (error) => {
        alert('Encounter error when loading payment gateway.');
      }
    );
  }

  rateService(number) {
    this.rate = number;
  }

  tipService(number) {
    if (this.amount === number) {
      return (this.amount = 0);
    }
    this.amount = number;
  }

  feedbackTags(tag) {
    if (!this.selectedTags) {
      this.selectedTags = [];
    }
    let existTag = this.selectedTags.findIndex((t) => t === tag);
    console.log('existTag', existTag);
    if (existTag === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(existTag, 1);
    }
    console.log('selectedTags', this.selectedTags);
  }

  checkTagExist(tag) {
    if (this.selectedTags) {
      let existTag = this.selectedTags.findIndex((t) => t === tag);
      if (existTag === -1) {
        console.log('false');
        return undefined;
      } else {
        console.log('true');
        return 'success';
      }
    }
  }

  checkSelectedTip(tip) {
    if (this.amount === tip) {
      return true;
    } else {
      return false;
    }
  }

  async presentAlert(message) {
    let url;
    const alert = await this.alertController.create({
      header: 'Feedback Sent',
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/order-history']);
          },
        },
      ],
    });

    await alert.present();
  }
}
