import { FormGroup } from '@angular/forms';

export class EmailValidator {
	static valid = true;
	
	static validEmail(fc: FormGroup){
		if(EmailValidator.valid == false){
			return ({validEmail: true});
		} else {
			return (null);
		}
	}
}