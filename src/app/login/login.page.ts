import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { environment, SERVER_URL } from '../../environments/environment';

import { GlobalVars } from './../providers/globalVars';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public production = false;
  fingerprint_authentication = false;
  email_address: string;
  user_password: string;
  maxlength = 255;

  constructor(
    private authService: AuthenticationService,
    public platform: Platform,
    private faio: FingerprintAIO,
    private storage: Storage,
    public globalVars: GlobalVars
  ) {
    this.production = environment.production;
  }

  async ngOnInit() {
    await this.storage.create();
    this.authService.ifLoggedIn();
  }

  async ionViewWillEnter() {
    this.fingerprint_authentication = false;
    const key: any = await this.storage.get('Fingerprint-Authentication');
    if (key != null && key.account_type) {
      this.fingerprint_authentication = true;
    }
  }

  signin() {
    this.authService.login(this.email_address, this.user_password);
  }

  bio_signin() {
    this.faio
      .isAvailable()
      .then((result: any) => {
        this.faio
          .show({
            cancelButtonTitle: 'Cancel',
            description:
              'Touch the fingerprint sensor zone to verify your fingerprint',
            disableBackup: true,
            title: 'Fingerprint Authentication',
            fallbackButtonTitle: 'Cancel',
          })
          .then(async (result: any) => {
            const key: any = await this.storage.get(
              'Fingerprint-Authentication'
            );
            if (key.account_type) {
              await this.storage.set(this.globalVars.token_value, key);
              this.authService.bio_login(key.account_type);
            }
          })
          .catch((error: any) => {});
      })
      .catch((error: any) => {});
  }
}
