import { Component } from '@angular/core';

import { GlobalVars } from './../providers/globalVars';

@Component({
  selector: 'app-tab-home',
  templateUrl: 'tab-home.page.html',
  styleUrls: ['tab-home.page.scss']
})
export class TabHomePage {
    pager = true;
    
    constructor(public globalVars: GlobalVars) {
    }
}
