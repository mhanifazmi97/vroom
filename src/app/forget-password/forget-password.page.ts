import { Component, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { NavController } from '@ionic/angular';
import { environment, SERVER_URL } from '../../environments/environment';
import { Router } from '@angular/router';
import * as uuid from 'uuid';

import { GlobalVars } from './../providers/globalVars';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage {
  @ViewChild('otp1') otp1: IonInput;
  @ViewChild('otp2') otp2: IonInput;
  @ViewChild('otp3') otp3: IonInput;
  @ViewChild('otp4') otp4: IonInput;
  @ViewChild('otp5') otp5: IonInput;
  @ViewChild('otp6') otp6: IonInput;

  passwordForm: FormGroup;
  form: FormGroup;
  load = false;
  otpVerifyFail = false;
  view = 'forget';
  otpv1 = '';
  otpv2 = '';
  otpv3 = '';
  otpv4 = '';
  otpv5 = '';
  otpv6 = '';
  otp_code = '';
  counter = 60;
  otp_timer: any;

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    public globalVars: GlobalVars,
    private formBuilder: FormBuilder,
    public navCtrl: NavController
  ) {
    this.form = this.formBuilder.group({
      mobile: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern(/^[0-9]\d*$/),
          Validators.minLength(8),
        ])
      ),
    });

    this.passwordForm = new FormGroup(
      {
        password: new FormControl(
          '',
          Validators.compose([Validators.required])
        ),
        repassword: new FormControl(
          '',
          Validators.compose([Validators.required])
        ),
      },
      {
        validators: this.matchingPasswords.bind(this),
      }
    );
  }

  ionViewWillEnter() {
    this.otp_code = uuid.v4();
    this.otpVerifyFail = false;

    this.passwordForm = new FormGroup(
      {
        password: new FormControl(
          '',
          Validators.compose([Validators.required])
        ),
        repassword: new FormControl(
          '',
          Validators.compose([Validators.required])
        ),
      },
      {
        validators: this.matchingPasswords.bind(this),
      }
    );
  }

  public errorMessages = {
    mobile: [
      { type: 'required', message: 'Phone number is required' },
      { type: 'pattern', message: 'Please enter a valid phone number' },
      {
        type: 'minlength',
        message: 'Phone number should be min 8 characters long.',
      },
    ],
    password: [{ type: 'required', message: 'Password is required' }],
    repassword: [{ type: 'required', message: 'Password is required' }],
  };

  get mobile() {
    return this.form.get('mobile');
  }

  get password() {
    return this.passwordForm.get('password');
  }

  get repassword() {
    return this.passwordForm.get('repassword');
  }

  matchingPasswords(formGroup: FormGroup) {
    const { value: p } = formGroup.controls['password'];
    const { value: confirmPassword } = formGroup.controls['repassword'];
    if (confirmPassword) {
      return p === confirmPassword ? null : { passwordNotMatch: true };
    } else {
      return null;
    }
  }

  otp() {
    this.load = true;
    const url = SERVER_URL + 'api/send/sms-otp';
    const params = new HttpParams()
      .set('token', this.globalVars.token)
      .set('phone', this.form.controls.mobile.value)
      .set('purpose', 'forget_password')
      .set('requester', 'customer');

    this.httpClient.post(url, params).subscribe(
      (response) => {
        console.log(response);
        let json_data = response;
        if (json_data['status_code'] == 200) {
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
            this.otp1.setFocus();
          }, 1000);
        }
        this.load = false;
      },
      (error) => {
        alert('Please check your internet connection and try again.');
        this.load = false;
      }
    );
  }

  otp_verify() {
    console.log('1', this.otpv1.toString());
    console.log('2', this.otpv2.toString());
    console.log('3', this.otpv3.toString());
    console.log('4', this.otpv4.toString());
    console.log('5', this.otpv5.toString());
    console.log('6', this.otpv6.toString());

    this.otpVerifyFail = false;
    if (
      this.otpv1 !== '' &&
      this.otpv2 !== '' &&
      this.otpv3 !== '' &&
      this.otpv4 !== '' &&
      this.otpv5 !== '' &&
      this.otpv6 !== ''
    ) {
      let opt_value =
        this.otpv1.toString() +
        this.otpv2.toString() +
        this.otpv3.toString() +
        this.otpv4.toString() +
        this.otpv5.toString() +
        this.otpv6.toString();

      if (opt_value == this.otp_code.toString()) {
        this.otpv1 = '';
        this.otpv2 = '';
        this.otpv3 = '';
        this.otpv4 = '';
        this.otpv5 = '';
        this.otpv6 = '';
        this.view = 'password';
      } else {
        this.otpVerifyFail = true;
      }
    }
  }

  otp_close() {
    clearInterval(this.otp_timer);
    this.view = 'forget';
  }

  otpController(event, next, prev) {
    if (event.target.value.length < 1 && prev) {
      if (prev == 'otp1') {
        this.otp1.setFocus();
      } else if (prev == 'otp2') {
        this.otp2.setFocus();
      } else if (prev == 'otp3') {
        this.otp3.setFocus();
      } else if (prev == 'otp4') {
        this.otp4.setFocus();
      } else if (prev == 'otp5') {
        this.otp5.setFocus();
      }
    } else if (next && event.target.value.length > 0) {
      if (next == 'otp2') {
        this.otp2.setFocus();
      } else if (next == 'otp3') {
        this.otp3.setFocus();
      } else if (next == 'otp4') {
        this.otp4.setFocus();
      } else if (next == 'otp5') {
        this.otp5.setFocus();
      } else if (next == 'otp6') {
        this.otp6.setFocus();
      }
    } else {
      return 0;
    }
  }

  numberOnlyValidation(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }

  reset() {
    this.load = true;

    const url = SERVER_URL + 'api/change-password';
    const params = new HttpParams()
      .set('token', this.globalVars.token)
      .set('username', this.form.controls.mobile.value)
      .set('new_password', this.passwordForm.controls.password.value)
      .set('role_type', 'customer');

    console.log(params);

    this.httpClient.post(url, params).subscribe(
      async (response) => {
        let json_data = response;
        alert(json_data['description']);
        if (json_data['status_code'] == 200) {
          this.router.navigate(['/login']);
        }
        this.load = false;
      },
      async (error) => {
        alert(error.error);
        this.load = false;
      }
    );
  }
}
