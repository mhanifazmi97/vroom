import { FormGroup } from '@angular/forms';

export class MobileValidator {
	static valid = true;
	
	static validMobile(fc: FormGroup){
		if(MobileValidator.valid == false){
			return ({validMobile: true});
		} else {
			return (null);
		}
	}
}