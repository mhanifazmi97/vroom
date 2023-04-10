import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ToastController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

import { GlobalVars } from './../providers/globalVars';
import { DummyData } from './../providers/dummyData';
import { environment, SERVER_URL } from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    authState = new BehaviorSubject(false);

    constructor(
        public globalVars: GlobalVars,
        public dummyData: DummyData,
        private router: Router,
        private storage: Storage,
        private httpClient: HttpClient,
        private platform: Platform,
        public toastController: ToastController
    ) {
        this.platform.ready().then(() => {
            this.ifLoggedIn();
        });
    }

    public httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    async ngOnInit() {
        await this.storage.create();
    }

    async ifLoggedIn() {
        const key: any = await this.storage.get(this.globalVars.token_value);

        if (key != null && key.role) {
            this.authState.next(true);
        }
    }

    login(username, password) {
        for (let i in this.dummyData.users) {
            let user = this.dummyData.users[i];

            if (username == user['username']) {
                this.storage.set(this.globalVars.token_value, user);
                this.storage.set('Fingerprint-Authentication', null);

                this.globalVars.setAccount(user);
                this.globalVars.getProfile();
                this.router.navigateByUrl('/');
                this.authState.next(true);
            }
        }
    }

    bio_login(account_type) {
        if (account_type == 'cleaner') {
            this.router.navigate(['/tabs/tab-job']);
        } else {
            this.router.navigate(['/']);
        }
        this.authState.next(true);
    }

    async logout() {
        await this.storage.remove(this.globalVars.token_value);
        this.router.navigate(['login']);
        this.authState.next(false);
    }

    isAuthenticated() {
        if (!this.authState.value) {
            this.router.navigate(['login']);
        }

        return this.authState.value;
    }

    checkAuthenticated() {
        return this.authState.value;
    }
}
