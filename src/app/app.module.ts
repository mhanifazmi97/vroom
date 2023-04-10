import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
//import { Push } from '@ionic-native/push/ngx';
import { AuthGuard } from './services/auth-guard.service';
import { AuthenticationService } from './services/authentication.service';
import { GlobalVars } from './providers/globalVars';
import { DummyData } from './providers/dummyData';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';

// Environment
import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Drivers, Storage } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        IonicStorageModule.forRoot({
            name: '__mydb',
            driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage],
        }),
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        AngularFireStorageModule,
        HttpClientModule,
    ],
    providers: [
        AuthGuard,
        AuthenticationService,
        //Push,
        GlobalVars,
        DummyData,
        InAppBrowser,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
