import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable()
export class ValidationServiceProvider {

    constructor() {
        console.log('Hello ErrorHandlerProvider Provider')
    }

    // Validation for password and confirm password
    static MatchPassword(AC: AbstractControl) {
       const newPassword = AC.get('new_password').value // to get value in input tag
       const confirmPassword = AC.get('confirm_password').value // to get value in input tag
        if(newPassword != confirmPassword) {
            console.log('false');
            AC.get('confirm_password').setErrors( { MatchPassword: true } )
        } else {
            console.log('true')
            AC.get('confirm_password').setErrors(null);
        }
    }
}